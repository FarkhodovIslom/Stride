import prisma from '../config/database';
import { calculateStreak } from '../utils/validation';

export class DashboardService {
    async getStats(userId: string) {
        const courses = await prisma.course.findMany({
            where: { userId },
            include: {
                lessons: true,
            },
        });

        const allLessons = courses.flatMap((c) => c.lessons);
        const totalLessons = allLessons.length;
        const completedLessons = allLessons.filter((l) => l.completed).length;
        const progressPercentage =
            totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

        // Calculate streak
        const completedDates = allLessons
            .filter((l) => l.completedAt)
            .map((l) => l.completedAt as Date);
        const streak = calculateStreak(completedDates);

        // Today's tasks (incomplete lessons)
        const todayTasks = allLessons
            .filter((l) => !l.completed)
            .slice(0, 5)
            .map((l) => ({
                id: l.id,
                title: l.title,
                status: l.status,
                completed: l.completed,
                completedAt: l.completedAt,
                courseId: l.courseId,
                createdAt: l.createdAt,
                updatedAt: l.updatedAt,
            }));

        return {
            totalCourses: courses.length,
            totalLessons,
            completedLessons,
            progressPercentage,
            streak,
            todayTasks,
        };
    }
}

export default new DashboardService();
