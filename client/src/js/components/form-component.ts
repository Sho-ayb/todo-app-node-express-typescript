import { Component } from './abstract-component';
import { TodoList } from './todo-list';
import { dispatchErrorEvent } from '../utils/errorUtils';

export class FormComponent extends Component<HTMLDivElement, HTMLFormElement> {
  todoDescEl!: HTMLInputElement;

  private todoList!: TodoList;

  constructor(todoList: TodoList) {
    super('form__template', 'app', true, 'form__input');

    this.todoList = todoList;

    // setup the event listener on the form
    this.configure();
  }

  configure(): void {
    this.todoDescEl = this.element.querySelector(
      '#description'
    ) as HTMLInputElement;

    this.element.addEventListener('submit', (event: Event) =>
      this.submitHandler(event)
    );
  }

  // call renderContent method to satisfy base class
  // eslint-disable-next-line class-methods-use-this
  renderContent(): void {}

  private submitHandler(event: Event): void {
    event.preventDefault();

    try {
      const userInput = this.gatherUserInput();

      console.log(userInput);

      if (userInput) {
        this.createTodo(userInput);
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatchErrorEvent(this.element, error, 'formError');
      }
    }
  }

  private gatherUserInput(): string | void {
    const todoDescInput = this.todoDescEl.value;

    console.log(todoDescInput);

    if (!todoDescInput) {
      throw new Error('Please enter some text');
    }

    this.todoDescEl.value = '';

    return todoDescInput;
  }

  // eslint-disable-next-line class-methods-use-this
  private async createTodo(text: string) {
    try {
      const response = await fetch('http://localhost:8000/todos/addTodo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      const { createdTodo } = responseData;

      console.log(responseData);

      // add the todo to the TodoList array
      this.todoList.addTodo(createdTodo);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          dispatchErrorEvent(
            this.element,
            new Error(
              'Could not create Todo. Please ensure the server is running.'
            ),
            'serverError'
          );
        } else {
          dispatchErrorEvent(
            this.element,
            new Error('Could not create todo'),
            'createTodoError'
          );
        }
      } else {
        dispatchErrorEvent(
          this.element,
          new Error('An unknown error occurred'),
          'unknownError'
        );
      }
    }
  }
}
