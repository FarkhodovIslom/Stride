"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useNotesStore } from "@/store/useNotesStore";
import RichTextEditor from "@/components/notes/RichTextEditor";
import { NotesSidebar } from "@/components/notes/NotesSidebar";
import { NoteHistoryDrawer } from "@/components/notes/NoteHistoryDrawer";
import { NotesList } from "@/components/notes/NotesList";
import { Card, Button, Modal } from "@/components/ui";
import type { Note } from "@/types";
import { NOTE_DEFAULTS } from "@/config/notes";
import { useTranslation } from "@/lib/i18n";

export default function NotesPage() {
    const {
        notes,
        categories,
        selectedNote,
        selectedCategoryId,
        isLoading,
        fetchNotes,
        fetchCategories,
        createNote,
        updateNote,
        deleteNote,
        selectNote,
        createCategory,
        deleteCategory,
        selectCategory,
    } = useNotesStore();

    const { t } = useTranslation();

    const [editingTitle, setEditingTitle] = useState(false);
    const [titleValue, setTitleValue] = useState("");
    const [showHistory, setShowHistory] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => { },
    });

    // Save status for auto-save indicator
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const pendingContentRef = useRef<string | null>(null);

    // Search and filter state
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchNotes();
        fetchCategories();
    }, [fetchNotes, fetchCategories]);

    useEffect(() => {
        if (selectedNote) {
            setTitleValue(selectedNote.title);
        }
    }, [selectedNote]);

    // Filter notes based on search query and category
    const filteredNotes = useMemo(() => {
        let filtered = notes;

        // Filter by category
        if (selectedCategoryId) {
            filtered = filtered.filter(note => note.categoryId === selectedCategoryId);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(note => {
                const titleMatch = note.title.toLowerCase().includes(query);
                // Also search in content (parse JSON and search in text)
                let contentMatch = false;
                try {
                    const content = JSON.parse(note.content);
                    const contentText = JSON.stringify(content).toLowerCase();
                    contentMatch = contentText.includes(query);
                } catch {
                    contentMatch = note.content.toLowerCase().includes(query);
                }
                return titleMatch || contentMatch;
            });
        }

        return filtered;
    }, [notes, selectedCategoryId, searchQuery]);

    const handleCreateNote = async () => {
        const note = await createNote({
            title: NOTE_DEFAULTS.TITLE,
            content: NOTE_DEFAULTS.CONTENT,
            categoryId: selectedCategoryId || undefined,
        });
        selectNote(note);
        setEditingTitle(true);
    };

    const handleTitleBlur = () => {
        if (selectedNote && titleValue !== selectedNote.title) {
            updateNote(selectedNote.id, { title: titleValue });
        }
        setEditingTitle(false);
    };

    // Debounced content save
    const debouncedSave = useCallback(
        (noteId: string, content: string) => {
            // Clear any existing timeout
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }

            pendingContentRef.current = content;
            setSaveStatus("saving");

            saveTimeoutRef.current = setTimeout(async () => {
                try {
                    await updateNote(noteId, { content });
                    setSaveStatus("saved");
                    pendingContentRef.current = null;

                    // Reset to idle after 2 seconds
                    setTimeout(() => setSaveStatus("idle"), 2000);
                } catch {
                    setSaveStatus("error");
                }
            }, 500); // 500ms debounce delay
        },
        [updateNote]
    );

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);

    const handleContentChange = (content: string) => {
        if (selectedNote) {
            debouncedSave(selectedNote.id, content);
        }
    };

    const handleCreateCategoryWrapper = async (name: string, color: string) => {
        await createCategory({ name, color });
    };

    const handleDeleteNote = async (note: Note) => {
        setConfirmDialog({
            isOpen: true,
            title: t('notes.deleteNote'),
            message: t('notes.deleteNoteConfirm'),
            onConfirm: async () => {
                await deleteNote(note.id);
                if (selectedNote?.id === note.id) {
                    selectNote(null);
                }
                setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
            },
        });
    };

    const handleDeleteCategory = async (id: string) => {
        setConfirmDialog({
            isOpen: true,
            title: t('notes.deleteCategory'),
            message: t('notes.deleteCategoryConfirm'),
            onConfirm: async () => {
                await deleteCategory(id);
                setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
            },
        });
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] gap-4 p-6">
            <div className="w-72 flex flex-col gap-4">
                <NotesSidebar
                    notes={notes}
                    categories={categories}
                    selectedCategoryId={selectedCategoryId}
                    onSelectCategory={selectCategory}
                    onCreateNote={handleCreateNote}
                    onCreateCategory={handleCreateCategoryWrapper}
                    onDeleteCategory={handleDeleteCategory}
                />

                {/* Search Input */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder={t('notes.search')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 pl-10 pr-10 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all"
                    />
                    <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                            title={t('notes.clearSearch')}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Search Results Count */}
                {searchQuery && (
                    <div className="text-xs text-[var(--muted-foreground)] px-2">
                        {filteredNotes.length} {t('notes.searchResults')}
                    </div>
                )}

                <NotesList
                    notes={filteredNotes}
                    selectedNoteId={selectedNote?.id}
                    isLoading={isLoading}
                    onSelectNote={selectNote}
                    onDeleteNote={handleDeleteNote}
                />            </div>

            {/* Editor Area */}
            <div className="flex-1 flex flex-col">
                {selectedNote ? (
                    <Card className="flex-1 flex flex-col overflow-hidden !p-0">
                        {/* Title */}
                        <div className="px-6 py-4 border-b border-[var(--border)]">
                            {editingTitle ? (
                                <input
                                    type="text"
                                    value={titleValue}
                                    onChange={(e) => setTitleValue(e.target.value)}
                                    onBlur={handleTitleBlur}
                                    onKeyDown={(e) => e.key === "Enter" && handleTitleBlur()}
                                    autoFocus
                                    className="w-full text-2xl font-bold bg-transparent border-none outline-none text-[var(--foreground)]"
                                />
                            ) : (
                                <h1
                                    onClick={() => setEditingTitle(true)}
                                    className="text-2xl font-bold cursor-pointer hover:text-primary-400 transition-colors text-[var(--foreground)]"
                                >
                                    {selectedNote.title}
                                </h1>
                            )}
                            <div className="flex items-center gap-4 mt-2 text-sm text-[var(--muted-foreground)]">
                                <span>Last updated: {new Date(selectedNote.updatedAt).toLocaleString()}</span>
                                {/* Save Status Indicator */}
                                {saveStatus === "saving" && (
                                    <span className="flex items-center gap-1 text-yellow-500">
                                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        {t('notes.saving')}
                                    </span>
                                )}
                                {saveStatus === "saved" && (
                                    <span className="flex items-center gap-1 text-green-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {t('notes.saved')}
                                    </span>
                                )}
                                {saveStatus === "error" && (
                                    <span className="flex items-center gap-1 text-red-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {t('notes.saveError')}
                                    </span>
                                )}
                                <button
                                    onClick={() => setShowHistory(true)}
                                    className="flex items-center gap-1 hover:text-primary-400 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {t('notes.history')}
                                </button>
                                {selectedNote.lesson && (
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        {t('notes.linkedTo')}: {selectedNote.lesson.title}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Editor */}
                        <div className="flex-1 overflow-auto">
                            <RichTextEditor
                                content={selectedNote.content}
                                onChange={handleContentChange}
                                placeholder={t('notes.placeholder')}
                            />
                        </div>
                    </Card>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-[var(--muted-foreground)]">
                        <div className="text-center">
                            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p>{t('notes.selectNote')}</p>
                        </div>
                    </div>
                )}
            </div>
            {/* History Drawer */}
            <NoteHistoryDrawer isOpen={showHistory} onClose={() => setShowHistory(false)} />

            {/* Confirm Dialog */}
            <Modal
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
                title={confirmDialog.title}
            >
                <div className="space-y-4">
                    <p className="text-[var(--muted-foreground)]">{confirmDialog.message}</p>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDialog.onConfirm}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
