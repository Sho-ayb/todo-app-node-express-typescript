import { DevConsole } from '../components/dev-console';

type ErrorHandler = (error: Error) => void;

export type ErrorEvent = CustomEvent<{ error: Error }>;

export const logError: ErrorHandler = (error) => {
  console.error(`An error occurred: ${error.message}`);
};

export const dispatchErrorEvent = (
  element: HTMLElement,
  error: Error,
  errorType: string = 'formError'
) => {
  const errorEvent: ErrorEvent = new CustomEvent(errorType, {
    detail: { error },
    bubbles: true,
  });

  // will dispatch on the element in the dom and not the global scope when using without: dispatchEvent(errorEvent)
  element.dispatchEvent(errorEvent);
};

export const setupErrorHandlers = (
  devConsole: DevConsole,
  formInput: HTMLElement,
  todoList: HTMLElement
) => {
  // these are the event listeners for the custom error handler(s) in FormComponent
  formInput.addEventListener('formError', ((event: ErrorEvent) => {
    const errorData = event.detail.error;
    logError(errorData);
    devConsole.displayMessage(`Form Error: ${errorData.message}`);
  }) as EventListener);

  formInput.addEventListener('serverError', ((error: ErrorEvent) => {
    const errorData = error.detail.error;
    logError(errorData);
    devConsole.displayMessage(`Server Error: ${errorData.message}`);
  }) as EventListener);

  formInput.addEventListener('createTodoError', ((error: ErrorEvent) => {
    const errorData = error.detail.error;
    logError(errorData);
    devConsole.displayMessage(`Create Todo Error: ${errorData.message}`);
  }) as EventListener);

  formInput.addEventListener('unknownError', ((error: ErrorEvent) => {
    const errorData = error.detail.error;
    logError(errorData);
    devConsole.displayMessage(`Server Error: ${errorData.message}`);
  }) as EventListener);

  // Event listener for errors in the TodoList component
  todoList.addEventListener('deleteError', ((error: ErrorEvent) => {
    const errorData = error.detail.error;
    logError(errorData);
    devConsole.displayMessage(`Deletion Error: ${errorData.message}`);
  }) as EventListener);
};
