"use client";

import { useEffect, useState } from "react";
import { useNotesStore } from "@/store/useNotesStore";
import RichTextEditor from "@/components/notes/RichTextEditor";
import { NotesSidebar } from "@/components/notes/NotesSidebar";
import { NoteHistoryDrawer } from "@/components/notes/NoteHistoryDrawer";
import { NotesList } from "@/components/notes/NotesList";
import { Card, Button, Modal } from "@/components/ui";
import type { Note } from "@/types";
import { NOTE_DEFAULTS } from "@/config/notes";

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

    useEffect(() => {
        fetchNotes();
        fetchCategories();
    }, [fetchNotes, fetchCategories]);

    useEffect(() => {
        if (selectedNote) {
            setTitleValue(selectedNote.title);
        }
    }, [selectedNote]);

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

    const handleContentChange = (content: string) => {
        if (selectedNote) {
            updateNote(selectedNote.id, { content });
        }
    };

    const handleCreateCategoryWrapper = async (name: string, color: string) => {
        await createCategory({ name, color });
    };

    const handleDeleteNote = async (note: Note) => {
        setConfirmDialog({
            isOpen: true,
            title: "Delete Note",
            message: "Are you sure you want to delete this note?",
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
            title: "Delete Category",
            message: "Are you sure you want to delete this category? All notes in this category will be uncategorized.",
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

                <NotesList
                    notes={notes}
                    selectedNoteId={selectedNote?.id}
                    isLoading={isLoading}
                    onSelectNote={selectNote}
                    onDeleteNote={handleDeleteNote}
                />
            </div>

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
                                <button
                                    onClick={() => setShowHistory(true)}
                                    className="flex items-center gap-1 hover:text-primary-400 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    History
                                </button>
                                {selectedNote.lesson && (
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        Linked to: {selectedNote.lesson.title}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Editor */}
                        <div className="flex-1 overflow-auto">
                            <RichTextEditor
                                content={selectedNote.content}
                                onChange={handleContentChange}
                                placeholder="Start writing your note..."
                            />
                        </div>
                    </Card>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-[var(--muted-foreground)]">
                        <div className="text-center">
                            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p>Select a note or create a new one</p>
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
