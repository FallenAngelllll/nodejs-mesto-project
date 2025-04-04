import { Router } from 'express';
import {
  getAllCards, createCard, removeCard, likeCard, dislikeCard,
} from '../controllers/card';

const router = Router();

router.get('/', getAllCards);
router.post('/', createCard);
router.delete('/:cardId', removeCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

export default router;
