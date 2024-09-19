import { Todo } from '../models/todo';

export const findTodo = (id: string, todosArr: Todo[]): Todo | undefined =>
  todosArr.find((todo) => todo.getId() === id);
