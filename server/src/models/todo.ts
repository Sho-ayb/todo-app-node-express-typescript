import crypto from 'crypto';

import { TodoStatus } from '../../../shared/types';

export class Todo {
  private id: string;

  private status: TodoStatus;

  // eslint-disable-next-line no-useless-constructor
  constructor(
    public text: string,
    id?: string,
    status: TodoStatus = TodoStatus.Active
  ) {
    // Constructor initialises id and text properties

    this.id = id || crypto.randomUUID();
    this.status = status;
  }

  // getter method to get id
  public getId(): string {
    return this.id;
  }

  // getter method to get status
  public getStatus(): TodoStatus {
    return this.status;
  }

  // setter method to update status
  public setStatus(newStatus: TodoStatus) {
    this.status = newStatus;
  }
}
