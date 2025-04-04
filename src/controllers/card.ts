import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';
import HttpStatus from '../utils/httpStatus';

export const getAllCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find({});
    return res.status(HttpStatus.OK).json(cards);
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Ошибка сервера' });
  }
};

export const createCard = async (req: Request, res: Response) => {
  try {
    const owner = req.user?._id;
    const { name, link } = req.body;

    if (!owner) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Пользователь не аутентифицирован' });
    }

    const newCard = await Card.create({ name, link, owner });
    return res.status(HttpStatus.CREATED).json(newCard);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Некорректные данные',
        error: error.message,
      });
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Ошибка сервера' });
  }
};

export const removeCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Неверный _id карточки' });
    }

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'Карточка не найдена' });
    }

    return res.status(HttpStatus.OK).json({ message: 'Карточка успешно удалена' });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Неверный _id карточки' });
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Ошибка сервера' });
  }
};

export const likeCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Неверный _id карточки' });
    }

    const card = await Card.findById(
      cardId,
      { $addToSet: { likes: req.user?._id } },
      { new: true },
    ).populate('owner');

    if (!card) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'Карточка не найдена' });
    }

    return res.status(HttpStatus.OK).json(card);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Неверный _id карточки' });
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Ошибка сервера' });
  }
};

export const dislikeCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Неверный _id карточки' });
    }

    const card = await Card.findById(
      cardId,
      { $pull: { likes: req.user?._id } },
      { new: true },
    ).populate('owner');

    if (!card) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'Карточка не найдена' });
    }

    return res.status(HttpStatus.OK).json(card);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Неверный _id карточки' });
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Ошибка сервера' });
  }
};
