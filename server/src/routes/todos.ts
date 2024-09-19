import { Router } from 'express';
import {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
} from '../controllers/todos';

const router = Router();

// REST Methods

router.post('/addTodo', createTodo);

router.get('/getTodos', getTodos);

router.patch('/:id', updateTodo);

router.delete('/:id', deleteTodo);

export default router;
