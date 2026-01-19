import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import notesService from '../services/notes.service';

export class NotesController {
    async createNote(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user?.id) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { title, content, lessonId, categoryId } = req.body;

            if (!title || title.trim().length === 0) {
                res.status(400).json({ error: 'Title is required' });
                return;
            }

            const note = await notesService.createNote(req.user.id, {
                title: title.trim(),
                content,
                lessonId,
                categoryId,
            });
            res.status(201).json({ note });
        } catch (error) {
            const err = error as Error;
            res.status(400).json({ error: err.message });
        }
    }

    async getNotes(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user?.id) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { categoryId } = req.query;
            const notes = await notesService.getNotes(
                req.user.id,
                categoryId as string | undefined
            );
            res.status(200).json({ notes });
        } catch (error) {
            const err = error as Error;
            res.status(400).json({ error: err.message });
        }
    }

    async getNote(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user?.id) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { id } = req.params;
            const note = await notesService.getNote(id, req.user.id);
            res.status(200).json({ note });
        } catch (error) {
            const err = error as Error;
            res.status(404).json({ error: err.message });
        }
    }

    async updateNote(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user?.id) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { id } = req.params;
            const { title, content, lessonId, categoryId } = req.body;
            const note = await notesService.updateNote(id, req.user.id, {
                title,
                content,
                lessonId,
                categoryId,
            });
            res.status(200).json({ note });
        } catch (error) {
            const err = error as Error;
            res.status(400).json({ error: err.message });
        }
    }

    async deleteNote(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user?.id) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { id } = req.params;
            await notesService.deleteNote(id, req.user.id);
            res.status(204).send();
        } catch (error) {
            const err = error as Error;
            res.status(400).json({ error: err.message });
        }
    }
}

export default new NotesController();
