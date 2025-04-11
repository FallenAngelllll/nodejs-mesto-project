import { ErrorRequestHandler } from 'express';
import HttpStatus from '../utils/httpStatus';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
  const message = statusCode === HttpStatus.INTERNAL_SERVER_ERROR ? 'На сервере произошла ошибка' : err.message;

  res.status(statusCode).send({ message });
  next();
};

export default errorHandler;
