import prisma from '../config/database';

export class NotesService {
    async createNote(
        userId: string,
        data: { title: string; content?: string; lessonId?: string; categoryId?: string }
    ) {
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

    async getNotes(userId: string, categoryId?: string) {
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

    async getNote(noteId: string, userId: string) {
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
    ) {
        const note = await prisma.note.findFirst({
            where: { id: noteId, userId },
        });

        if (!note) {
            throw new Error('Note not found');
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

    async deleteNote(noteId: string, userId: string) {
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
}

export default new NotesService();
