import { Router } from 'express';
import { getAllCards, createCard, removeCard, likeCard, dislikeCard } from '../controllers/card';

const router = Router();

router.get('/cards', getAllCards);
router.post('/cards', createCard);
router.delete('/cards/:cardId', removeCard);
router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', dislikeCard);

export default router;