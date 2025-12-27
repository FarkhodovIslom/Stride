"use client";

import { create } from "zustand";
import type { Course, CreateCourseInput, UpdateCourseInput } from "@/types";

interface CoursesStore {
  courses: Course[];
  isLoading: boolean;
  error: string | null;
  fetchCourses: () => Promise<void>;
  addCourse: (data: CreateCourseInput) => Promise<Course>;
  updateCourse: (id: string, data: UpdateCourseInput) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
}

export const useCoursesStore = create<CoursesStore>((set, get) => ({
  courses: [],
  isLoading: false,
  error: null,

  fetchCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/courses");
      if (!response.ok) throw new Error("Failed to fetch courses");
      const data = await response.json();
      set({ courses: data.courses, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addCourse: async (data: CreateCourseInput) => {
    const response = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create course");
    }
    const { course } = await response.json();
    set({ courses: [course, ...get().courses] });
    return course;
  },

  updateCourse: async (id: string, data: UpdateCourseInput) => {
    const response = await fetch(`/api/courses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update course");
    }
    const { course } = await response.json();
    set({
      courses: get().courses.map((c) => (c.id === id ? course : c)),
    });
  },

  deleteCourse: async (id: string) => {
    const response = await fetch(`/api/courses/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete course");
    }
    set({ courses: get().courses.filter((c) => c.id !== id) });
  },
}));
