import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import coursesService from '../services/courses.service';

export class CoursesController {
    async getCourses(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user?.id) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const courses = await coursesService.getCourses(req.user.id);
            res.status(200).json({ courses });
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ error: err.message });
        }
    }

    async getCourse(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user?.id) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { id } = req.params;
            const course = await coursesService.getCourse(id, req.user.id);
            res.status(200).json({ course });
        } catch (error) {
            const err = error as Error;
            res.status(404).json({ error: err.message });
        }
    }

    async createCourse(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user?.id) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { title, description } = req.body;
            const course = await coursesService.createCourse(
                req.user.id,
                title,
                description
            );
            res.status(201).json({ course });
        } catch (error) {
            const err = error as Error;
            res.status(400).json({ error: err.message });
        }
    }

    async updateCourse(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user?.id) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { id } = req.params;
            const { title, description } = req.body;
            const course = await coursesService.updateCourse(
                id,
                req.user.id,
                title,
                description
            );
            res.status(200).json({ course });
        } catch (error) {
            const err = error as Error;
            res.status(400).json({ error: err.message });
        }
    }

    async deleteCourse(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user?.id) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { id } = req.params;
            await coursesService.deleteCourse(id, req.user.id);
            res.status(204).send();
        } catch (error) {
            const err = error as Error;
            res.status(400).json({ error: err.message });
        }
    }
}

export default new CoursesController();
