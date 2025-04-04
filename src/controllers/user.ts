import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/user';
import HttpStatus from '../utils/httpStatus';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.status(HttpStatus.OK).json(users);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Ошибка сервера' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Некорректный _id пользователя' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Пользователь по id не найден' });
      return;
    }

    res.status(HttpStatus.OK).json(user);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Ошибка обработки идентификатора пользователя' });
    } else {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Ошибка сервера' });
    }
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  try {
    const newUser = await User.create({ name, about, avatar });
    res.status(HttpStatus.CREATED).json(newUser);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Ошибка валидации при создании аккаунта', error: error.message });
    } else {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Ошибка сервера' });
    }
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { name, about } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Пользователь не аутентифицирован' });
      return;
    }

    const updatedUser = await User.findById(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Пользователь не найден' });
      return;
    }

    res.status(HttpStatus.OK).json(updatedUser);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Ошибка валидации', error: error.message });
    } else {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Ошибка сервера' });
    }
  }
};

export const updateUserAvatar = async (req: Request, res: Response) => {
  try {
    const { avatar } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Пользователь не аутентифицирован' });
      return;
    }

    const updatedUser = await User.findById(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Пользователь не найден' });
      return;
    }

    res.status(HttpStatus.OK).json(updatedUser);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Ошибка валидации', error: error.message });
    } else {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Ошибка сервера' });
    }
  }
};
