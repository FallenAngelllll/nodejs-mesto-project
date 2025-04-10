import { Router } from 'express';
import {
  getAllUsers, getUserById, getCurrentUser, updateUserProfile, updateUserAvatar,
} from '../controllers/user';
import { profileInfoValidation, idValidationRules, avatarUrlValidation } from '../middlewares/validation';

const router = Router();

router.get('/', getAllUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', idValidationRules, getUserById);
router.patch('/me', profileInfoValidation, updateUserProfile);
router.patch('/me/avatar', avatarUrlValidation, updateUserAvatar);

export default router;
