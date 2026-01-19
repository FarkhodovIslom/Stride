import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import notesService from '../services/notes.service';
import { CreateNoteDto, UpdateNoteDto } from '../dtos/notes.dto';

export class NotesController {
    async createNote(req: AuthRequest, res: Response): Promise<void> {
        try {
            const dto = req.body as CreateNoteDto;
            const note = await notesService.createNote(req.user!.id, {
                title: dto.title.trim(),
                content: dto.content,
                lessonId: dto.lessonId,
                categoryId: dto.categoryId,
            });
            res.status(201).json({ note });
        } catch (error) {
            const err = error as Error;
            res.status(400).json({ error: err.message });
        }
    }

    async getNotes(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { categoryId } = req.query;
            const notes = await notesService.getNotes(
                req.user!.id,
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
            const { id } = req.params;
            const note = await notesService.getNote(id, req.user!.id);
            res.status(200).json({ note });
        } catch (error) {
            const err = error as Error;
            res.status(404).json({ error: err.message });
        }
    }

    async updateNote(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const dto = req.body as UpdateNoteDto;
            const note = await notesService.updateNote(id, req.user!.id, dto);
            res.status(200).json({ note });
        } catch (error) {
            const err = error as Error;
            res.status(400).json({ error: err.message });
        }
    }

    async deleteNote(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await notesService.deleteNote(id, req.user!.id);
            res.status(204).send();
        } catch (error) {
            const err = error as Error;
            res.status(400).json({ error: err.message });
        }
    }

    async getVersions(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const versions = await notesService.getNoteVersions(id, req.user!.id);
            res.status(200).json({ versions });
        } catch (error) {
            const err = error as Error;
            res.status(400).json({ error: err.message });
        }
    }

    async restoreVersion(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id, versionId } = req.params;
            const note = await notesService.restoreNoteVersion(id, versionId, req.user!.id);
            res.status(200).json({ note });
        } catch (error) {
            const err = error as Error;
            res.status(400).json({ error: err.message });
        }
    }
}

export default new NotesController();

