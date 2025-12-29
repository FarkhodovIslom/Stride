import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import dashboardController from '../controllers/dashboard.controller';

const router = Router();

/**
 * @route   GET /dashboard/stats
 * @desc    Get dashboard statistics for the current user
 * @access  Private
 */
router.get('/stats', authenticate, (req, res) =>
    dashboardController.getStats(req, res)
);

export default router;
