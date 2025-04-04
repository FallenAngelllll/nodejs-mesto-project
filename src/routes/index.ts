import { Router, Request, Response } from 'express';
import userRouter from './user';
import cardRouter from './card';

const router = Router();

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Такой маршрут не существует' });
});

export default router;
