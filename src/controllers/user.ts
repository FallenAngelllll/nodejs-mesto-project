import { Request, Response } from 'express';
import User from '../models/user'
import mongoose from 'mongoose';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const getUserById = async (req: Request, res: Response) => {

  const { userId } = req.params;

  try {

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: 'Некорректный _id пользователя' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'Пользователь по id не найден' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      res.status(400).json({ message: 'Ошибка обработки идентификатора пользователя' });
    } else {
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
};

export const createUser = async (req: Request, res: Response) => {

  const { name, about, avatar } = req.body;

  try {

    const newUser = await User.create({ name, about, avatar });
    res.status(201).json(newUser);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: 'Ошибка валидации при создании аккаунта', error: error.message });
    } else {
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {

    const { name, about } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ message: 'Пользователь не аутентифицирован' });
      return;
    }

    const updatedUser = await User.findById(
      userId,
      { name, about },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).json({ message: 'Пользователь не найден' });
      return;
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: 'Ошибка валидации', error: error.message });
    } else {
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
};

export const updateUserAvatar = async (req: Request, res: Response) => {
  try {

    const { avatar } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ message: 'Пользователь не аутентифицирован' });
      return;
    }

    const updatedUser = await User.findById(
      userId,
      { avatar },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).json({ message: 'Пользователь не найден' });
      return;
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: 'Ошибка валидации', error: error.message });
    } else {
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
};