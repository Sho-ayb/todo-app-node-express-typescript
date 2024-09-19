import express, { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line import/no-extraneous-dependencies
import cors from 'cors';

// import the todo routes

import todoRoutes from './routes/todos';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:9000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

const PORT = 8000;

// connect the routes with a middleware with the url /todos
// all REST routes will begin with /todos e.g. todos/addTodo & /todos/getTodos etc

app.use('/todos', todoRoutes);

// setting up an error middleware function - to do that the first parameter of the middleware function will be err

// Note that the express import provides the necessary types for typescript above as Request, Response and NextFunction but we can also use a RequestHandler type and declare as the type of a function, we can see this over in the controllers todos.ts file

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
