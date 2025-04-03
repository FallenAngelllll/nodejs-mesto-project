import express, { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose';
import userRouter from './routes/user';
import cardRouter from './routes/card';

const PORT = 3000;
const server = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

server.use((req: Request, res: Response, next: NextFunction)=>{
  req.user = {
    _id: '67ee7a4f9338c9080ac4ac2f'
  };

  next();
});

server.use(express.json())

server.use('/', userRouter)
server.use('/', cardRouter)


server.listen(+PORT, () => {
  console.log(`Сервер успешно стартовал на порту: ${PORT}`);
});