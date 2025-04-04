import { Router } from 'express';
import {
  getAllUsers, getUserById, createUser, updateUserProfile, updateUserAvatar,
} from '../controllers/user';

const router = Router();

router.get('/', getAllUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', updateUserProfile);
router.patch('/me/avatar', updateUserAvatar);

export default router;
