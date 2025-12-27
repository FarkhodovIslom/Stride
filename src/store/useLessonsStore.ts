"use client";

import { create } from "zustand";
import type { Lesson, CreateLessonInput, UpdateLessonInput, LessonStatus } from "@/types";

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
      const response = await fetch(`/api/courses/${courseId}`);
      if (!response.ok) throw new Error("Failed to fetch lessons");
      const data = await response.json();
      set({
        lessons: { ...get().lessons, [courseId]: data.course.lessons || [] },
        isLoading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addLesson: async (data: CreateLessonInput) => {
    const response = await fetch("/api/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create lesson");
    }
    const { lesson } = await response.json();
    const currentLessons = get().lessons[data.courseId] || [];
    set({
      lessons: {
        ...get().lessons,
        [data.courseId]: [...currentLessons, lesson],
      },
    });
    return lesson;
  },

  updateLesson: async (id: string, courseId: string, data: UpdateLessonInput) => {
    const response = await fetch(`/api/lessons/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update lesson");
    }
    const { lesson } = await response.json();
    const currentLessons = get().lessons[courseId] || [];
    set({
      lessons: {
        ...get().lessons,
        [courseId]: currentLessons.map((l) => (l.id === id ? lesson : l)),
      },
    });
  },

  deleteLesson: async (id: string, courseId: string) => {
    const response = await fetch(`/api/lessons/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete lesson");
    }
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
      const response = await fetch(`/api/lessons/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, completed }),
      });
      if (!response.ok) throw new Error("Failed to move lesson");
      const { lesson: updatedLesson } = await response.json();
      set({
        lessons: {
          ...get().lessons,
          [courseId]: currentLessons.map((l) => (l.id === id ? updatedLesson : l)),
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
      const response = await fetch(`/api/lessons/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: newCompleted, status: newStatus }),
      });
      if (!response.ok) throw new Error("Failed to toggle lesson");
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
