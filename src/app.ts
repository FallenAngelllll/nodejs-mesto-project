import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import routes from './routes';

const PORT = 3000;
const server = express();

server.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '67ee7a4f9338c9080ac4ac2f',
  };
  next();
});

server.use(express.json());
server.use(routes);

mongoose
  .connect('mongodb://localhost:27017/mestodb')
  .then(() => {
    server.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Сервер успешно стартовал на порту: ${PORT}`);
    });
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Ошибка подключения к базе данных:', error);
  });
