import { Router } from 'express';
import authController from '../controllers/auth.controller';

const router = Router();

/**
 * @route   POST /auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', (req, res) => authController.register(req, res));

/**
 * @route   POST /auth/login
 * @desc    Login user and get JWT token
 * @access  Public
 */
router.post('/login', (req, res) => authController.login(req, res));

export default router;
