import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import usersController from '../controllers/users.controller';

const router = Router();

/**
 * @route   GET /users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticate, (req, res) =>
    usersController.getProfile(req, res)
);

/**
 * @route   PATCH /users/profile
 * @desc    Update current user profile
 * @access  Private
 */
router.patch('/profile', authenticate, (req, res) =>
    usersController.updateProfile(req, res)
);

export default router;
