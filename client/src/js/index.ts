'use-strict';

// importing the style file
import '../scss/style.scss';

// importing ts files

import { FormComponent } from './components/form-component';
import { DevConsole } from './components/dev-console';
import { TodoList } from './components/todo-list';
import { setupErrorHandlers } from './utils/errorUtils';

document.addEventListener('DOMContentLoaded', () => {
  const init = () => {
    try {
      const devConsole = new DevConsole();
      const todoList = new TodoList(devConsole);
      const formInput = new FormComponent(todoList);

      setupErrorHandlers(devConsole, formInput.element, todoList.element);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  init();
});
