import prisma from '../config/database';

export class CoursesService {
    async getCourses(userId: string) {
        const courses = await prisma.course.findMany({
            where: { userId },
            include: {
                lessons: true,
                _count: { select: { lessons: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        return courses;
    }

    async getCourse(courseId: string, userId: string) {
        const course = await prisma.course.findFirst({
            where: { id: courseId, userId },
            include: {
                lessons: true,
                _count: { select: { lessons: true } },
            },
        });

        if (!course) {
            throw new Error('Course not found');
        }

        return course;
    }

    async createCourse(userId: string, title: string, description?: string) {
        if (!title || title.trim().length === 0) {
            throw new Error('Course title is required');
        }

        const course = await prisma.course.create({
            data: {
                title: title.trim(),
                description: description?.trim() || null,
                userId,
            },
            include: {
                lessons: true,
                _count: { select: { lessons: true } },
            },
        });

        return course;
    }

    async updateCourse(
        courseId: string,
        userId: string,
        title?: string,
        description?: string
    ) {
        // Verify ownership
        const existingCourse = await prisma.course.findFirst({
            where: { id: courseId, userId },
        });

        if (!existingCourse) {
            throw new Error('Course not found');
        }

        const updateData: { title?: string; description?: string | null } = {};
        if (title !== undefined) updateData.title = title.trim();
        if (description !== undefined)
            updateData.description = description?.trim() || null;

        const course = await prisma.course.update({
            where: { id: courseId },
            data: updateData,
            include: {
                lessons: true,
                _count: { select: { lessons: true } },
            },
        });

        return course;
    }

    async deleteCourse(courseId: string, userId: string) {
        // Verify ownership
        const existingCourse = await prisma.course.findFirst({
            where: { id: courseId, userId },
        });

        if (!existingCourse) {
            throw new Error('Course not found');
        }

        await prisma.course.delete({
            where: { id: courseId },
        });
    }
}

export default new CoursesService();
