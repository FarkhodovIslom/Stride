import prisma from '../config/database';
import type { Note, NoteCategory, Lesson } from '@prisma/client';

type NoteWithRelations = Note & {
    category: NoteCategory | null;
    lesson: { id: string; title: string } | null;
};

export class NotesService {
    async createNote(
        userId: string,
        data: { title: string; content?: string; lessonId?: string; categoryId?: string }
    ): Promise<NoteWithRelations> {
        // Validate lesson ownership if lessonId is provided
        if (data.lessonId) {
            const lesson = await prisma.lesson.findFirst({
                where: { id: data.lessonId },
                include: { course: true },
            });
            if (!lesson || lesson.course.userId !== userId) {
                throw new Error('Invalid lesson ID or you do not have access to this lesson');
            }
        }

        // Validate category ownership if categoryId is provided
        if (data.categoryId) {
            const category = await prisma.noteCategory.findFirst({
                where: { id: data.categoryId, userId },
            });
            if (!category) {
                throw new Error('Invalid category ID or you do not have access to this category');
            }
        }

        const note = await prisma.note.create({
            data: {
                title: data.title,
                content: data.content || '{}',
                userId,
                lessonId: data.lessonId || null,
                categoryId: data.categoryId || null,
            },
            include: {
                category: true,
                lesson: { select: { id: true, title: true } },
            },
        });
        return note;
    }

    async getNotes(userId: string, categoryId?: string): Promise<NoteWithRelations[]> {
        const notes = await prisma.note.findMany({
            where: {
                userId,
                ...(categoryId && { categoryId }),
            },
            include: {
                category: true,
                lesson: { select: { id: true, title: true } },
            },
            orderBy: { updatedAt: 'desc' },
        });
        return notes;
    }

    async getNote(noteId: string, userId: string): Promise<NoteWithRelations> {
        const note = await prisma.note.findFirst({
            where: { id: noteId, userId },
            include: {
                category: true,
                lesson: { select: { id: true, title: true } },
            },
        });

        if (!note) {
            throw new Error('Note not found');
        }

        return note;
    }

    async updateNote(
        noteId: string,
        userId: string,
        data: { title?: string; content?: string; lessonId?: string | null; categoryId?: string | null }
    ): Promise<NoteWithRelations> {
        const note = await prisma.note.findFirst({
            where: { id: noteId, userId },
        });

        if (!note) {
            throw new Error('Note not found');
        }

        // Validate lesson ownership if lessonId is being changed
        if (data.lessonId !== undefined && data.lessonId !== null) {
            const lesson = await prisma.lesson.findFirst({
                where: { id: data.lessonId },
                include: { course: true },
            });
            if (!lesson || lesson.course.userId !== userId) {
                throw new Error('Invalid lesson ID or you do not have access to this lesson');
            }
        }

        // Validate category ownership if categoryId is being changed
        if (data.categoryId !== undefined && data.categoryId !== null) {
            const category = await prisma.noteCategory.findFirst({
                where: { id: data.categoryId, userId },
            });
            if (!category) {
                throw new Error('Invalid category ID or you do not have access to this category');
            }
        }

        // Create a version snapshot of the current state if content or title is changing
        if ((data.content && data.content !== note.content) || (data.title && data.title !== note.title)) {
            await prisma.noteVersion.create({
                data: {
                    noteId: note.id,
                    content: note.content,
                },
            });
        }

        const updatedNote = await prisma.note.update({
            where: { id: noteId },
            data: {
                ...(data.title !== undefined && { title: data.title }),
                ...(data.content !== undefined && { content: data.content }),
                ...(data.lessonId !== undefined && { lessonId: data.lessonId }),
                ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
            },
            include: {
                category: true,
                lesson: { select: { id: true, title: true } },
            },
        });

        return updatedNote;
    }

    async deleteNote(noteId: string, userId: string): Promise<void> {
        const note = await prisma.note.findFirst({
            where: { id: noteId, userId },
        });

        if (!note) {
            throw new Error('Note not found');
        }

        await prisma.note.delete({
            where: { id: noteId },
        });
    }

    async getNoteVersions(noteId: string, userId: string) {
        const note = await prisma.note.findFirst({
            where: { id: noteId, userId },
        });

        if (!note) {
            throw new Error('Note not found');
        }

        return prisma.noteVersion.findMany({
            where: { noteId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async restoreNoteVersion(noteId: string, versionId: string, userId: string): Promise<NoteWithRelations> {
        const note = await prisma.note.findFirst({
            where: { id: noteId, userId },
        });

        if (!note) {
            throw new Error('Note not found');
        }

        const version = await prisma.noteVersion.findFirst({
            where: { id: versionId, noteId },
        });

        if (!version) {
            throw new Error('Version not found');
        }

        // Save current state as a new version before restoring (safety net)
        await prisma.noteVersion.create({
            data: {
                noteId: note.id,
                content: note.content,
            },
        });

        // Update note content with version content
        const restoredNote = await prisma.note.update({
            where: { id: noteId },
            data: {
                content: version.content,
            },
            include: {
                category: true,
                lesson: { select: { id: true, title: true } },
            },
        });

        return restoredNote;
    }
}

export default new NotesService();
