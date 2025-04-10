import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';
import HttpStatus from '../utils/httpStatus';
import BadRequestError from '../errors/badRequestError';
import NotFoundError from '../errors/notFoundError';
import UnauthorizedError from '../errors/unauthorizedError';
import ForbiddenError from '../errors/forbiddenError';

export const getAllCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});
    res.send({ data: cards });
  } catch (error) {
    next(error);
  }
};

export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const owner = req.user?._id;
    const { name, link } = req.body;

    if (!owner) {
      throw new UnauthorizedError('Пользователь не аутентифицирован');
    }

    const newCard = await Card.create({ name, link, owner });
    res.status(HttpStatus.CREATED).send({ data: newCard });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError(error.message));
    } else {
      next(error);
    }
  }
};

export const removeCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { cardId } = req.params;

  if (!req.user?._id) {
    return next(
      new BadRequestError('Не передан id текущего пользователя для удаления карточки'),
    );
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return next(new BadRequestError('Неверный _id карточки'));
    }

    const card = await Card.findById(cardId);

    if (!card) {
      return next(new NotFoundError('Карточка не найдена'));
    }

    if (card.owner.toString() !== req.user._id) {
      return next(
        new ForbiddenError(
          'Карточка не принадлежит текущему пользователю. Невозможно удалить карточку',
        ),
      );
    }

    await card.deleteOne();
    return res.send({ data: card });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('Некорректный формат _id карточки'));
    }

    return next(error);
  }
};

export const likeCard = async (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      throw new BadRequestError('Неверный _id карточки');
    }

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user?._id } },
      { new: true },
    ).populate('owner');

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }

    res.send({ data: card });
  } catch (error) {
    next(error);
  }
};

export const dislikeCard = async (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      throw new BadRequestError('Неверный _id карточки');
    }

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user?._id } },
      { new: true },
    ).populate('owner');

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }

    res.send({ data: card });
  } catch (error) {
    next(error);
  }
};
