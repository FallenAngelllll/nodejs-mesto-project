import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/unauthorizedError';

const { JWT_SECRET = 'any-secret-key' } = process.env;

type JSONWebTokenPayload = {
  _id: string;
} | undefined;

const auth = (req: Request, res: Response, next: NextFunction): void => {
  const { token } = req.cookies;

  if (!token) {
    return next(new UnauthorizedError('Доступ запрещен, необходима авторизация'));
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET) as JSONWebTokenPayload;
    return next();
  } catch {
    return next(new UnauthorizedError('Доступ запрещен, необходима авторизация'));
  }
};

export default auth;
