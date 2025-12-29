import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import lessonsService from '../services/lessons.service';

export class LessonsController {
    async createLesson(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user?.id) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { title, courseId } = req.body;
            const lesson = await lessonsService.createLesson(
                courseId,
                req.user.id,
                title
            );
            res.status(201).json({ lesson });
        } catch (error) {
            const err = error as Error;
            res.status(400).json({ error: err.message });
        }
    }

    async getLesson(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user?.id) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { id } = req.params;
            const lesson = await lessonsService.getLesson(id, req.user.id);
            res.status(200).json({ lesson });
        } catch (error) {
            const err = error as Error;
            res.status(404).json({ error: err.message });
        }
    }

    async updateLesson(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user?.id) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { id } = req.params;
            const { title, status, completed } = req.body;
            const lesson = await lessonsService.updateLesson(id, req.user.id, {
                title,
                status,
                completed,
            });
            res.status(200).json({ lesson });
        } catch (error) {
            const err = error as Error;
            res.status(400).json({ error: err.message });
        }
    }

    async deleteLesson(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user?.id) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { id } = req.params;
            await lessonsService.deleteLesson(id, req.user.id);
            res.status(204).send();
        } catch (error) {
            const err = error as Error;
            res.status(400).json({ error: err.message });
        }
    }
}

export default new LessonsController();
