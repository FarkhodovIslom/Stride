import prisma from '../config/database';

export class LessonsService {
    async createLesson(courseId: string, userId: string, title: string) {
        if (!title || title.trim().length === 0) {
            throw new Error('Lesson title is required');
        }

        // Verify course belongs to user
        const course = await prisma.course.findFirst({
            where: { id: courseId, userId },
        });

        if (!course) {
            throw new Error('Course not found');
        }

        const lesson = await prisma.lesson.create({
            data: {
                title: title.trim(),
                courseId,
            },
        });

        return lesson;
    }

    async getLesson(lessonId: string, userId: string) {
        const lesson = await prisma.lesson.findFirst({
            where: {
                id: lessonId,
                course: { userId },
            },
            include: {
                course: true,
            },
        });

        if (!lesson) {
            throw new Error('Lesson not found');
        }

        return lesson;
    }

    async updateLesson(
        lessonId: string,
        userId: string,
        data: { title?: string; status?: string; completed?: boolean }
    ) {
        // Verify lesson belongs to user's course
        const lesson = await prisma.lesson.findFirst({
            where: {
                id: lessonId,
                course: { userId },
            },
        });

        if (!lesson) {
            throw new Error('Lesson not found');
        }

        const updateData: {
            title?: string;
            status?: string;
            completed?: boolean;
            completedAt?: Date | null;
        } = {};

        if (data.title !== undefined) updateData.title = data.title.trim();
        if (data.status !== undefined) updateData.status = data.status;
        if (data.completed !== undefined) {
            updateData.completed = data.completed;
            updateData.completedAt = data.completed ? new Date() : null;
        }

        const updatedLesson = await prisma.lesson.update({
            where: { id: lessonId },
            data: updateData,
        });

        return updatedLesson;
    }

    async deleteLesson(lessonId: string, userId: string) {
        // Verify lesson belongs to user's course
        const lesson = await prisma.lesson.findFirst({
            where: {
                id: lessonId,
                course: { userId },
            },
        });

        if (!lesson) {
            throw new Error('Lesson not found');
        }

        await prisma.lesson.delete({
            where: { id: lessonId },
        });
    }
}

export default new LessonsService();
