import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import dashboardService from '../services/dashboard.service';

export class DashboardController {
    async getStats(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user?.id) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const stats = await dashboardService.getStats(req.user.id);
            res.status(200).json({ stats });
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ error: err.message });
        }
    }
}

export default new DashboardController();
