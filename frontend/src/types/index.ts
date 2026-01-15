export type LessonStatus = "planned" | "progress" | "completed";

export interface User {
  id: string;
  email: string;
  name?: string | null;
  createdAt: Date;
  updatedAt: Date;
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
  status: LessonStatus;
  completed: boolean;
  completedAt?: Date | null;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCourseInput {
  title: string;
  description?: string;
}

export interface UpdateCourseInput {
  title?: string;
  description?: string;
}

export interface CreateLessonInput {
  title: string;
  courseId: string;
}

export interface UpdateLessonInput {
  title?: string;
  status?: LessonStatus;
  completed?: boolean;
}

export interface DashboardStats {
  totalCourses: number;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  streak: number;
  todayTasks: Lesson[];
}

export interface CourseWithProgress extends Course {
  lessons: Lesson[];
  progress: number;
}
