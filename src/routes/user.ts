import { Router } from 'express';
import { getAllUsers, getUserById, createUser, updateUserProfile, updateUserAvatar } from '../controllers/user';

const router = Router();

router.get('/users', getAllUsers);
router.get('/users/:userId', getUserById);
router.post('/users', createUser);
router.patch('/users/me', updateUserProfile);
router.patch('/users/me/avatar', updateUserAvatar);


export default router;