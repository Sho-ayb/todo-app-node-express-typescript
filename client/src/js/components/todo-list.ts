import { TodoStatus } from '../../../../shared/types';
import { Component } from './abstract-component';
import { Todo } from '../models/todo';
import { TodoItem } from './todo-item';
import { dispatchErrorEvent } from '../utils/errorUtils';
import { DevConsole } from './dev-console';

export class TodoList extends Component<HTMLDivElement, HTMLUListElement> {
  private todos: Todo[] = [];

  private API_BASE_URL = 'http://localhost:8000';

  private devConsole!: DevConsole;

  constructor(devConsole: DevConsole) {
    super('todo__template', 'app', false, 'list');

    this.devConsole = devConsole;

    this.configure();
    this.initialiseTodos();
  }

  configure() {
    // listening to dispatch events from todo item component
    this.element.addEventListener('deleteTodo', ((
      event: CustomEvent<{ id: string }>
    ) => {
      this.handleDelete(event);
    }) as EventListener);

    this.element.addEventListener('updateTodo', ((
      event: CustomEvent<{ id: string; newText: string }>
    ) => {
      this.handleUpdate(event);
    }) as EventListener);

    this.element.addEventListener('stateChangeTodo', ((
      event: CustomEvent<{ id: string; text: string; newStatus: string }>
    ) => {
      this.handleTodoStateChange(event);
    }) as EventListener);
  }

  // invoked when a new todo is created
  renderContent() {
    this.element.innerHTML = '';
    this.todos.forEach((todo) => {
      TodoItem.create(this.element, todo);

      console.log(this.todos);
    });
  }

  // getter method always returns the length of the todos array
  get todoCount(): number {
    return this.todos.length;
  }

  public addTodo(todoData: Todo) {
    this.todos.push(todoData);
    this.renderContent();
    this.updateDevConsole();
  }

  // a method to update the dev console everytime a todo is added or removed
  private updateDevConsole() {
    const numberOfTodos = this.todoCount;
    this.devConsole.displayMessage(
      `Total todos: ${numberOfTodos} ${numberOfTodos === 1 ? 'todo' : 'todos'}`
    );
  }

  private handleDelete(event: CustomEvent<{ id: string }>) {
    const todoId = event.detail.id;
    if (todoId) {
      this.deleteTodo(todoId);
      this.updateDevConsole();
    }
  }

  private async deleteTodo(id: string) {
    console.log('Attempting to delete todo', id);
    const { success, message } = await this.deleteTodoFromServer(id);
    if (success) {
      console.log('Todo deleted successfully');
      this.todos = this.todos.filter((todo) => todo.id !== id);
      this.renderContent();
      this.devConsole.displayMessage(message);
    } else {
      dispatchErrorEvent(
        this.element,
        new Error('Can not delete from server'),
        'deleteError'
      );
    }
  }

  private async deleteTodoFromServer(
    id: string
  ): Promise<{ success: boolean; message: string | null }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/todos/${id}`, {
        method: 'DELETE',
      });

      // getting the response data from server
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return { success: true, message: responseData.message };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
    return { success: false, message: null };
  }

  private async handleUpdate(
    event: CustomEvent<{ id: string; newText: string }>
  ) {
    const { id, newText } = event.detail;
    const { success, message } = await this.updateTodoOnServer(id, newText);
    if (success) {
      const todoIndex = this.todos.findIndex((todo) => todo.id === id);
      if (todoIndex !== -1) {
        // i am mutating the original todos array but you can get rid of the findIndex altogether and use the map method to return a new array by spreading the original todos and the text: newText.
        // this.todos[todoIndex] = { ...this.todos[todoIndex], text: newText };

        // it is better to use map to return a new array
        this.todos = this.todos.map((todo) =>
          todo.id === id ? { ...todo, text: newText } : todo
        );

        const todoLIElement = this.element.querySelector(
          `[data-id="${id}"]`
        )! as HTMLLIElement;

        console.log(todoLIElement);

        if (todoLIElement) {
          TodoItem.updateOnElement(todoLIElement, this.todos[todoIndex]);
          this.devConsole.displayMessage(message);
        }

        console.log(this.todos);
      }
    } else {
      dispatchErrorEvent(
        this.element,
        new Error('Server Error: Can not update todo'),
        'serverError'
      );
    }
  }

  private async updateTodoOnServer(
    id: string,
    newText: string,
    status: TodoStatus = TodoStatus.Active
  ): Promise<{ success: boolean; message: string | null }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newText, status }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      return { success: true, message: responseData.message };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }

    return { success: false, message: null };
  }

  // because fetchTodos is an async method when called it returns a promise that we need to await, for this we create another method to await the promise and catch any errors
  private async initialiseTodos() {
    try {
      await this.fetchTodos();
    } catch (error) {
      console.log('Failed to inialise todos');
      dispatchErrorEvent(
        this.element,
        new Error('Failed to initialise todos'),
        'ServerError'
      );
    }
  }

  private async fetchTodos() {
    console.log('this has reached fetch todos method');

    try {
      console.log('and reached inside of try catch');
      const response = await fetch(`${this.API_BASE_URL}/todos/getTodos`);

      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }

      const todosData: Todo[] = await response.json();

      this.todos = todosData.map((todoData: Todo) => ({
        id: todoData.id,
        text: todoData.text,
        status: todoData.status,
      }));

      console.log('Processed todos from server: ', this.todos);
      // render the content for every todo
      this.renderContent();
    } catch (error) {
      dispatchErrorEvent(
        this.element,
        new Error('Server Error: Failed to fetch todos'),
        'ServerError'
      );
    }
  }

  private async handleTodoStateChange(event: CustomEvent) {
    const { id, text, newStatus } = event.detail;
    console.log(
      'event caught in the todo list component when checkbox clicked!',
      id,
      newStatus
    );

    const { success, message } = await this.updateTodoOnServer(
      id,
      text,
      newStatus
    );

    if (success) {
      const foundTodo = this.todos.find((todo) => todo.id === id);

      console.log(foundTodo);

      this.devConsole.displayMessage(message);
    } else {
      dispatchErrorEvent(
        this.element,
        new Error('Server Error: Failed to update the todo'),
        'ServerError'
      );
    }
  }
}
