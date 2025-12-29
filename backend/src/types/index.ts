export interface User {
    id: string;
    email: string;
    name?: string | null;
    createdAt: Date;
}

export interface Course {
    id: string;
    title: string;
    description?: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    lessons?: Lesson[];
    _count?: {
        lessons: number;
    };
}

export interface Lesson {
    id: string;
    title: string;
    status: 'planned' | 'progress' | 'completed';
    completed: boolean;
    completedAt?: Date | null;
    courseId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface DashboardStats {
    totalCourses: number;
    totalLessons: number;
    completedLessons: number;
    progressPercentage: number;
    streak: number;
    todayTasks: Lesson[];
}

export interface JWTPayload {
    id: string;
    email: string;
}

export interface AuthRequest extends Request {
    user?: JWTPayload;
}
