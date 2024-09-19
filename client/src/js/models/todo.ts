import { TodoStatus } from '../../../../shared/types';

export interface Todo {
  id: string;
  text: string;
  status: TodoStatus;
}
