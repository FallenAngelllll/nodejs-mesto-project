import { Router } from 'express';
import {
  getAllCards, createCard, removeCard, likeCard, dislikeCard,
} from '../controllers/card';
import { cardValidationRules, cardIdValidationRules } from '../middlewares/validation';

const router = Router();

router.get('/', getAllCards);
router.post('/', cardValidationRules, createCard);
router.delete('/:cardId', cardIdValidationRules, removeCard);
router.put('/:cardId/likes', cardIdValidationRules, likeCard);
router.delete('/:cardId/likes', cardIdValidationRules, dislikeCard);

export default router;
