"use client";

import { create } from "zustand";
import type {
  Note,
  NoteCategory,
  CreateNoteInput,
  UpdateNoteInput,
  CreateCategoryInput,
  UpdateCategoryInput,
  NoteVersion,
} from "@/types";
import apiClient from "@/lib/api";

interface NotesStore {
  notes: Note[];
  categories: NoteCategory[];
  selectedNote: Note | null;
  selectedCategoryId: string | null;
  isLoading: boolean;
  error: string | null;

  // Notes actions
  fetchNotes: (categoryId?: string) => Promise<void>;
  fetchNote: (id: string) => Promise<void>;
  createNote: (data: CreateNoteInput) => Promise<Note>;
  updateNote: (id: string, data: UpdateNoteInput) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  selectNote: (note: Note | null) => void;

  // Categories actions
  fetchCategories: () => Promise<void>;
  createCategory: (data: CreateCategoryInput) => Promise<NoteCategory>;
  updateCategory: (id: string, data: UpdateCategoryInput) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  selectCategory: (categoryId: string | null) => void;

  // Version actions
  versions: NoteVersion[];
  fetchVersions: (noteId: string) => Promise<void>;
  restoreVersion: (noteId: string, versionId: string) => Promise<void>;
}

export const useNotesStore = create<NotesStore>((set, get) => ({
  notes: [],
  categories: [],
  selectedNote: null,
  selectedCategoryId: null,
  isLoading: false,
  error: null,

  // Notes actions
  fetchNotes: async (categoryId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const query = categoryId ? `?categoryId=${categoryId}` : "";
      const data = await apiClient.get<{ notes: Note[] }>(`/notes${query}`, true);
      set({ notes: data.notes, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchNote: async (id: string) => {
    try {
      const data = await apiClient.get<{ note: Note }>(`/notes/${id}`, true);
      set({ selectedNote: data.note });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  createNote: async (data: CreateNoteInput) => {
    const response = await apiClient.post<{ note: Note }>("/notes", data, true);
    set({ notes: [response.note, ...get().notes] });
    return response.note;
  },

  updateNote: async (id: string, data: UpdateNoteInput) => {
    const response = await apiClient.put<{ note: Note }>(`/notes/${id}`, data, true);
    set({
      notes: get().notes.map((n) => (n.id === id ? response.note : n)),
      selectedNote: get().selectedNote?.id === id ? response.note : get().selectedNote,
    });
  },

  deleteNote: async (id: string) => {
    await apiClient.delete(`/notes/${id}`, true);
    set({
      notes: get().notes.filter((n) => n.id !== id),
      selectedNote: get().selectedNote?.id === id ? null : get().selectedNote,
    });
  },

  selectNote: (note: Note | null) => {
    set({ selectedNote: note });
  },

  // Categories actions
  fetchCategories: async () => {
    try {
      const data = await apiClient.get<{ categories: NoteCategory[] }>("/categories", true);
      set({ categories: data.categories });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  createCategory: async (data: CreateCategoryInput) => {
    const response = await apiClient.post<{ category: NoteCategory }>("/categories", data, true);
    set({ categories: [...get().categories, response.category] });
    return response.category;
  },

  updateCategory: async (id: string, data: UpdateCategoryInput) => {
    const response = await apiClient.put<{ category: NoteCategory }>(`/categories/${id}`, data, true);
    set({
      categories: get().categories.map((c) => (c.id === id ? response.category : c)),
    });
  },

  deleteCategory: async (id: string) => {
    await apiClient.delete(`/categories/${id}`, true);
    set({
      categories: get().categories.filter((c) => c.id !== id),
      selectedCategoryId: get().selectedCategoryId === id ? null : get().selectedCategoryId,
    });
  },

  selectCategory: (categoryId: string | null) => {
    set({ selectedCategoryId: categoryId });
    get().fetchNotes(categoryId || undefined);
  },

  // Version actions
  versions: [],
  fetchVersions: async (noteId: string) => {
      try {
          const data = await apiClient.get<{ versions: NoteVersion[] }>(`/notes/${noteId}/versions`, true);
          set({ versions: data.versions });
      } catch (error) {
          set({ error: (error as Error).message });
      }
  },

  restoreVersion: async (noteId: string, versionId: string) => {
      try {
        const response = await apiClient.post<{ note: Note }>(`/notes/${noteId}/versions/${versionId}/restore`, {}, true);
        
        set({
            selectedNote: response.note,
            notes: get().notes.map((n) => (n.id === noteId ? response.note : n)),
        });

        // Refetch versions to see the new snapshot created during restore
        get().fetchVersions(noteId);
      } catch (error) {
        set({ error: (error as Error).message });
      }
  },
}));
