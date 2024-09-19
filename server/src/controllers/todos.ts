import { RequestHandler } from 'express';

// the above type is available because we have installed @types express in the dev dependency

import { Todo } from '../models/todo';
import { findTodo } from '../utils/findTodo';

let TODOS: Todo[] = [];

// To use named export for a single function in a file: by default eslint throws an import/prefer-default-export, to switch this off use import/prefer-default-export: off as a rule in the eslint config.

// route: /todos/addTodo
export const createTodo: RequestHandler = (req, res, _next) => {
  const { text } = req.body as { text: string };

  if (!text) {
    return res.status(404).json({ error: 'Text is required' });
  }

  const newTodo = new Todo(text);

  TODOS.push(newTodo);

  return res.status(201).json({
    message: 'Server: Todo created successfully',
    createdTodo: newTodo,
  });
};

// route: todos/getTodos
export const getTodos: RequestHandler = (req, res, _next) => res.json(TODOS);

// route: todos/updateTodo
export const updateTodo: RequestHandler = (req, res, _next) => {
  const { id: todoId } = req.params;
  const { text: todoText, status } = req.body;

  const foundTodo = findTodo(todoId, TODOS);
  console.log(todoId, foundTodo);

  if (!foundTodo) {
    return res
      .status(404)
      .json({ message: 'Server: Todo with id does not exist' });
  }

  const updatedTodo = new Todo(todoText, todoId, status);

  // update the existing array with the updateTodo in place using the map method
  TODOS = TODOS.map((todo) =>
    todo.getId() === foundTodo?.getId() ? updatedTodo : todo
  );

  return res.status(200).json({
    message: `Server: Todo matching id ${todoId} sucessfully updated`,
  });
};

// route: todos/deleteTodo

export const deleteTodo: RequestHandler = (req, res, _next) => {
  const { id: todoId } = req.params;

  const foundTodo = findTodo(todoId, TODOS);

  if (!foundTodo)
    return res
      .status(404)
      .json({ message: `Todo with id ${todoId} does not exist` });

  TODOS = TODOS.filter((todo) => todo.getId() !== foundTodo.getId());

  return res
    .status(200)
    .json({ message: `Todo with id ${todoId} sucessfully deleted` });
};
