"use client";

import { create } from "zustand";
import type { Lesson, CreateLessonInput, UpdateLessonInput, LessonStatus } from "@/types";
import apiClient from "@/lib/api";

interface LessonsStore {
  lessons: Record<string, Lesson[]>;
  isLoading: boolean;
  error: string | null;
  fetchLessons: (courseId: string) => Promise<void>;
  addLesson: (data: CreateLessonInput) => Promise<Lesson>;
  updateLesson: (id: string, courseId: string, data: UpdateLessonInput) => Promise<void>;
  deleteLesson: (id: string, courseId: string) => Promise<void>;
  moveLesson: (id: string, courseId: string, newStatus: LessonStatus) => Promise<void>;
  toggleCompleted: (id: string, courseId: string) => Promise<void>;
}

export const useLessonsStore = create<LessonsStore>((set, get) => ({
  lessons: {},
  isLoading: false,
  error: null,

  fetchLessons: async (courseId: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiClient.get<{ course: { lessons: Lesson[] } }>(
        `/courses/${courseId}`,
        true
      );
      set({
        lessons: { ...get().lessons, [courseId]: data.course.lessons || [] },
        isLoading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addLesson: async (data: CreateLessonInput) => {
    const response = await apiClient.post<{ lesson: Lesson }>(
      "/lessons",
      data,
      true
    );
    const currentLessons = get().lessons[data.courseId] || [];
    set({
      lessons: {
        ...get().lessons,
        [data.courseId]: [...currentLessons, response.lesson],
      },
    });
    return response.lesson;
  },

  updateLesson: async (id: string, courseId: string, data: UpdateLessonInput) => {
    const response = await apiClient.put<{ lesson: Lesson }>(
      `/lessons/${id}`,
      data,
      true
    );
    const currentLessons = get().lessons[courseId] || [];
    set({
      lessons: {
        ...get().lessons,
        [courseId]: currentLessons.map((l) => (l.id === id ? response.lesson : l)),
      },
    });
  },

  deleteLesson: async (id: string, courseId: string) => {
    await apiClient.delete(`/lessons/${id}`, true);
    const currentLessons = get().lessons[courseId] || [];
    set({
      lessons: {
        ...get().lessons,
        [courseId]: currentLessons.filter((l) => l.id !== id),
      },
    });
  },

  moveLesson: async (id: string, courseId: string, newStatus: LessonStatus) => {
    const currentLessons = get().lessons[courseId] || [];
    const lesson = currentLessons.find((l) => l.id === id);
    if (!lesson) return;

    // Optimistic update
    const completed = newStatus === "completed";
    set({
      lessons: {
        ...get().lessons,
        [courseId]: currentLessons.map((l) =>
          l.id === id
            ? { ...l, status: newStatus, completed, completedAt: completed ? new Date() : null }
            : l
        ),
      },
    });

    try {
      const response = await apiClient.put<{ lesson: Lesson }>(
        `/lessons/${id}`,
        { status: newStatus, completed },
        true
      );
      set({
        lessons: {
          ...get().lessons,
          [courseId]: currentLessons.map((l) => (l.id === id ? response.lesson : l)),
        },
      });
    } catch {
      // Revert on error
      set({
        lessons: {
          ...get().lessons,
          [courseId]: currentLessons,
        },
      });
    }
  },

  toggleCompleted: async (id: string, courseId: string) => {
    const currentLessons = get().lessons[courseId] || [];
    const lesson = currentLessons.find((l) => l.id === id);
    if (!lesson) return;

    const newCompleted = !lesson.completed;
    const newStatus: LessonStatus = newCompleted ? "completed" : "progress";

    // Optimistic update
    set({
      lessons: {
        ...get().lessons,
        [courseId]: currentLessons.map((l) =>
          l.id === id
            ? { ...l, completed: newCompleted, status: newStatus, completedAt: newCompleted ? new Date() : null }
            : l
        ),
      },
    });

    try {
      await apiClient.put(
        `/lessons/${id}`,
        { completed: newCompleted, status: newStatus },
        true
      );
    } catch {
      // Revert on error
      set({
        lessons: {
          ...get().lessons,
          [courseId]: currentLessons,
        },
      });
    }
  },
}));
