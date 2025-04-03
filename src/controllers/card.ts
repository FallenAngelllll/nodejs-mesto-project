import { Request, Response } from 'express';
import Card from '../models/card';
import mongoose from 'mongoose';

export const getAllCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find({});
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const createCard = async (req: Request, res: Response) => {
  try {

    const owner = req.user?._id;

    const { name, link } = req.body;

    if (!owner) {
      return res.status(401).json({ message: 'Пользователь не аутентифицирован' });
    }

    const newCard = await Card.create({ name, link, owner });
    res.status(201).json(newCard);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({
        message: 'Некорректные данные',
        error: error.message,
      });
    } else {
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
};

export const removeCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(400).json({ message: 'Неверный _id карточки' });
    }

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: 'Карточка не найдена' });
    }

    res.status(200).json({ message: 'Карточка успешно удалена' });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      res.status(400).json({ message: 'Неверный _id карточки' });
    } else {
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
};

export const likeCard = async (req: Request, res: Response) => {
  try {

    const { cardId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(400).json({ message: 'Неверный _id карточки' });
    }

    const card = await Card.findById(
      cardId,
      { $addToSet: { likes: req.user?._id } },
      { new: true }
    ).populate('owner');

    if (!card) {
      return res.status(404).json({ message: 'Карточка не найдена' });
    }

    res.status(200).json(card);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      res.status(400).json({ message: 'Неверный _id карточки' });
    } else {
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
};

export const dislikeCard = async (req: Request, res: Response) => {
  try {

    const { cardId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(400).json({ message: 'Неверный _id карточки' });
    }

    const card = await Card.findById(
      cardId,
      { $pull: { likes: req.user?._id } },
      { new: true }
    ).populate('owner');

    if (!card) {
      return res.status(404).json({ message: 'Карточка не найдена' });
    }

    res.status(200).json(card);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      res.status(400).json({ message: 'Неверный _id карточки' });
    } else {
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
};