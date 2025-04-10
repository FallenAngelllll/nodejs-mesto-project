import {
  Router, Request, Response, NextFunction,
} from 'express';
import NotFoundError from '../errors/notFoundError';
import userRouter from './user';
import cardRouter from './card';
import { credentialsValidationRules, userDataValidation } from '../middlewares/validation';
import { createUser, login } from '../controllers/user';
import auth from '../middlewares/auth';

const router = Router();

router.post('/signup', userDataValidation, createUser);
router.post('/signin', credentialsValidationRules, login);

router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Такой маршрут не существует'));
});

export default router;
