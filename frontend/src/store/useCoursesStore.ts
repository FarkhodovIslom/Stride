"use client";

import { create } from "zustand";
import type { Course, CreateCourseInput, UpdateCourseInput } from "@/types";
import apiClient from "@/lib/api";

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
      const data = await apiClient.get<{ courses: Course[] }>("/courses", true);
      set({ courses: data.courses, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addCourse: async (data: CreateCourseInput) => {
    const response = await apiClient.post<{ course: Course }>(
      "/courses",
      data,
      true
    );
    set({ courses: [response.course, ...get().courses] });
    return response.course;
  },

  updateCourse: async (id: string, data: UpdateCourseInput) => {
    const response = await apiClient.put<{ course: Course }>(
      `/courses/${id}`,
      data,
      true
    );
    set({
      courses: get().courses.map((c) => (c.id === id ? response.course : c)),
    });
  },

  deleteCourse: async (id: string) => {
    await apiClient.delete(`/courses/${id}`, true);
    set({ courses: get().courses.filter((c) => c.id !== id) });
  },
}));
