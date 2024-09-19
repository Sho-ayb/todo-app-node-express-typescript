import { TodoStatus } from '../../../../shared/types';
import { Component } from './abstract-component';
import { Todo } from '../models/todo';

export class TodoItem extends Component<HTMLUListElement, HTMLLIElement> {
  private todo: Todo;

  private isEditing = false;

  private todoTextElement: HTMLElement;

  private static todoItemMap = new WeakMap<HTMLElement, TodoItem>();

  constructor(hostEl: HTMLUListElement, todo: Todo) {
    super('todo-item__template', hostEl, false, false);
    this.todo = todo;
    // query selecting h2 element without creating it here: make sure you are using this.element instead of document.querySelector to query select the h2 in this element
    this.todoTextElement = this.element.querySelector('h2')!;
    console.log(this.todoTextElement);
    // setting the instance to this element with weakmap
    TodoItem.todoItemMap.set(this.element, this);

    this.configure();
    this.renderContent();
  }

  // static method to return the instance
  static getTodoItem(element: HTMLElement): TodoItem | undefined {
    return TodoItem.todoItemMap.get(element);
  }

  static create(hostElement: HTMLUListElement, todo: Todo): TodoItem {
    const todoItem = new TodoItem(hostElement, todo);
    todoItem.renderContent();
    return todoItem;
  }

  static updateOnElement(element: HTMLLIElement, todo: Todo): void {
    const todoItem = TodoItem.getTodoItem(element);
    if (todoItem && todoItem instanceof TodoItem) {
      console.log('updated on element method is invoked');
      todoItem.updateTodo(todo);
    }
  }

  configure() {
    this.element.dataset.id = this.todo.id;
    const iconTrash = this.element.querySelector('.bxs-trash-alt');
    const iconEdit = this.element.querySelector('.bxs-edit-alt');
    const iconCheckBox = this.element.querySelector('.bx-check-circle');

    iconTrash?.classList.add('delete__btn');
    iconEdit?.classList.add('edit__btn');
    iconCheckBox?.classList.add('checkbox__icon');

    const deleteBtn = this.element.querySelector('.delete__btn');
    const editBtn = this.element.querySelector('.edit__btn');
    const checkBoxBtn = this.element.querySelector('.hidden__checkbox');

    console.log(checkBoxBtn);

    // event listener for the delete btn
    if (deleteBtn) {
      deleteBtn.addEventListener('click', ((event: MouseEvent) => {
        this.handleDelete(event);
      }) as EventListener);
    }

    // event listener for the edit btn

    if (editBtn) {
      editBtn.addEventListener('click', this.handleEdit.bind(this));
    }

    if (checkBoxBtn) {
      checkBoxBtn.addEventListener('change', ((event: Event) => {
        this.handleTodoStateChange(event);
      }) as EventListener);
    }
  }

  renderContent() {
    if (this.isEditing) {
      let input = this.element.querySelector(
        '.todo__input'
      ) as HTMLInputElement;

      if (!input) {
        input = document.createElement('input');
        input.classList.add('todo__input');
        // maintains the current todo text in the input field
        input.value = this.todoTextElement.textContent || '';
        // allows for the input to update even if user does not hit enter key
        input.addEventListener('blur', ((event: MouseEvent) => {
          this.handleUpdate(event);
        }) as EventListener);
        // allows for the input to update when the user hits the enter key
        input.addEventListener('keyup', ((event: KeyboardEvent) => {
          if (event.key === 'Enter') this.handleUpdate(event);
        }) as EventListener);

        // checks if the text element already exists and will remove it amd inserts a text input element
        if (
          this.todoTextElement &&
          this.element.contains(this.todoTextElement)
        ) {
          console.log('Removing the text element is exec');
          // only updates the heading text in the dom
          this.element.removeChild(this.todoTextElement);
        }
        this.element.insertBefore(input, this.element.firstChild);
      }
      input.focus();
    } else {
      console.log('Else block in render content is executed');

      let h2Element = this.element.querySelector('h2');
      const checkboxElement = this.element.querySelector(
        '.hidden__checkbox'
      )! as HTMLElement;
      const iconCheckBox = this.element.querySelector(
        '.checkbox__icon'
      )! as HTMLElement;
      const todoItemElement = this.element! as HTMLLIElement;

      console.log(iconCheckBox);

      if (!h2Element) {
        h2Element = document.createElement('h2');
        this.element.insertBefore(h2Element, this.element.firstChild);
      }
      this.todoTextElement = h2Element;
      this.todoTextElement.textContent = this.todo.text;

      if (checkboxElement) {
        console.log(
          'checkbox element from render content method: ',
          checkboxElement
        );

        if (this.todo.status === TodoStatus.Completed) {
          this.todoTextElement.classList.add('strikethrough');
          iconCheckBox.classList.remove('bx-check-circle');
          iconCheckBox.classList.add('bxs-check-circle');
        } else {
          this.todoTextElement.classList.remove('strikethrough');
          iconCheckBox.classList.add('bx-check-circle');
          iconCheckBox.classList.remove('bxs-check-circle');
        }

        console.log(todoItemElement);

        if (todoItemElement) {
          todoItemElement.style.backgroundColor =
            this.todo.status === TodoStatus.Completed
              ? 'rgba(255, 255, 255, 0.5)'
              : '';
        }
      }

      const existingInput = this.element.querySelector('.todo__input');

      if (existingInput && existingInput.parentNode === this.element) {
        this.element.removeChild(existingInput);
      }
    }
  }

  updateTodo(newTodo: Todo) {
    console.log(newTodo);
    this.todo = newTodo;
    this.renderContent();
  }

  //  private methods

  private handleDelete(event: MouseEvent) {
    event?.stopPropagation(); // prevents the the specific click event from bubbling up to TodoList

    // creating a new custom event that bubbles up to todolist component, so can be captured there
    const deleteEvent = new CustomEvent('deleteTodo', {
      bubbles: true,
      detail: { id: this.todo.id },
    });

    this.element.dispatchEvent(deleteEvent);
    console.log('Delete event dispatched', this.todo.id);
  }

  private handleEdit() {
    this.isEditing = true;
    this.renderContent();
  }

  private handleUpdate(event: MouseEvent | KeyboardEvent) {
    if (this.isEditing) {
      event.preventDefault();
      const input = event.target as HTMLInputElement;
      const newText = input.value.trim();
      if (newText && newText !== this.todo.text) {
        // creating a custom event to dispatcth the event to bubble up to todo list component where we can update the todos array and the todos in the server side.
        const updateEvent = new CustomEvent('updateTodo', {
          bubbles: true,
          detail: { id: this.todo.id, newText },
        });
        // dispatch this custom event
        this.element.dispatchEvent(updateEvent);
      }
    }
    this.isEditing = false;
  }

  private handleTodoStateChange(event: Event) {
    event.preventDefault();
    console.log('this checkbox was clicked on', event);
    // we need to change the state of the status in the todo
    this.todo.status =
      this.todo.status === TodoStatus.Active
        ? TodoStatus.Completed
        : TodoStatus.Active;
    console.log(this.todo.status);

    const stateChangeEvent = new CustomEvent('stateChangeTodo', {
      bubbles: true,
      detail: {
        id: this.todo.id,
        text: this.todo.text,
        newStatus: this.todo.status,
      },
    });

    // dispatch this custom event
    this.element.dispatchEvent(stateChangeEvent);

    this.renderContent();
  }
}
