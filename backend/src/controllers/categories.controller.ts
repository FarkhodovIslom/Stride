import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import categoriesService from '../services/categories.service';

export class CategoriesController {
    async createCategory(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user?.id) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { name, color } = req.body;

            if (!name || name.trim().length === 0) {
                res.status(400).json({ error: 'Name is required' });
                return;
            }

            const category = await categoriesService.createCategory(req.user.id, {
                name: name.trim(),
                color,
            });
            res.status(201).json({ category });
        } catch (error) {
            const err = error as Error;
            res.status(400).json({ error: err.message });
        }
    }

    async getCategories(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user?.id) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const categories = await categoriesService.getCategories(req.user.id);
            res.status(200).json({ categories });
        } catch (error) {
            const err = error as Error;
            res.status(400).json({ error: err.message });
        }
    }

    async updateCategory(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user?.id) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { id } = req.params;
            const { name, color } = req.body;
            const category = await categoriesService.updateCategory(id, req.user.id, {
                name,
                color,
            });
            res.status(200).json({ category });
        } catch (error) {
            const err = error as Error;
            res.status(400).json({ error: err.message });
        }
    }

    async deleteCategory(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user?.id) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { id } = req.params;
            await categoriesService.deleteCategory(id, req.user.id);
            res.status(204).send();
        } catch (error) {
            const err = error as Error;
            res.status(400).json({ error: err.message });
        }
    }
}

export default new CategoriesController();
