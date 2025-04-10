import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import HttpStatus from '../utils/httpStatus';
import NotFoundError from '../errors/notFoundError';
import BadRequestError from '../errors/badRequestError';
import ConflictError from '../errors/conflictError';
import UnauthorizedError from '../errors/unauthorizedError';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    res.send({ data: users });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new BadRequestError('Некорректный _id пользователя');
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('Пользователь по id не найден');
    }

    res.send({ data: user });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const userId = req.user?._id;
  if (!userId) {
    next(new UnauthorizedError('Пользователь не аутентифицирован'));
    return;
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      next(new NotFoundError('Пользователь не найден'));
      return;
    }

    res.send({ data: user });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ConflictError('Пользователь с таким email уже существует'));
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: hashPassword,
    });

    return res.status(HttpStatus.CREATED).json({ data: newUser });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError(error.message));
    }

    return next(error);
  }
};

const { JWT_SECRET = 'any-secret-key' } = process.env;

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      next(new UnauthorizedError('Неправильные почта или пароль'));
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      next(new UnauthorizedError('Неправильные почта или пароль'));
      return;
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(HttpStatus.OK).json({ token });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const userId = req.user?._id;

  try {
    if (!userId) {
      throw new UnauthorizedError('Пользователь не аутентифицирован');
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      throw new NotFoundError('Пользователь не найден');
    }

    res.send({ data: updatedUser });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError(error.message));
    } else {
      next(error);
    }
  }
};

export const updateUserAvatar = async (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const userId = req.user?._id;

  try {
    if (!userId) {
      throw new UnauthorizedError('Пользователь не аутентифицирован');
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      throw new NotFoundError('Пользователь не найден');
    }

    res.send({ data: updatedUser });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError(error.message));
    } else {
      next(error);
    }
  }
};
