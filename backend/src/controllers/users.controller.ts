import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import usersService from '../services/users.service';

export class UsersController {
    async getProfile(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user?.id) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const user = await usersService.getProfile(req.user.id);
            res.status(200).json(user);
        } catch (error) {
            const err = error as Error;
            res.status(404).json({ error: err.message });
        }
    }

    async updateProfile(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user?.id) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { name } = req.body;
            const updatedUser = await usersService.updateProfile(req.user.id, name);
            res.status(200).json(updatedUser);
        } catch (error) {
            const err = error as Error;
            res.status(400).json({ error: err.message });
        }
    }
}

export default new UsersController();
