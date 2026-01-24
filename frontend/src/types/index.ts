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
  dueDate?: Date | null;
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
  dueDate?: string;
}

export interface UpdateLessonInput {
  title?: string;
  status?: LessonStatus;
  completed?: boolean;
  dueDate?: string | null;
}

export interface DashboardStats {
  totalCourses: number;
  activeCourses: number;
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

// Notes types
export interface NoteCategory {
  id: string;
  name: string;
  color: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  _count?: { notes: number };
}

export interface Note {
  id: string;
  title: string;
  content: string;
  userId: string;
  lessonId?: string | null;
  categoryId?: string | null;
  category?: NoteCategory | null;
  lesson?: { id: string; title: string } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNoteInput {
  title: string;
  content?: string;
  lessonId?: string;
  categoryId?: string;
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
  lessonId?: string | null;
  categoryId?: string | null;
}

export interface CreateCategoryInput {
  name: string;
  color?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  color?: string;
}

export interface NoteVersion {
  id: string;
  noteId: string;
  content: string;
  createdAt: Date;
}

