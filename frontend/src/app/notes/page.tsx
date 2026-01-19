"use client";

import { useEffect, useState } from "react";
import { useNotesStore } from "@/store/useNotesStore";
import RichTextEditor from "@/components/notes/RichTextEditor";
import { Button, Card, Modal, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Note, NoteCategory } from "@/types";

const CATEGORY_COLORS = [
    "#6366f1", // Indigo
    "#8b5cf6", // Violet
    "#ec4899", // Pink
    "#ef4444", // Red
    "#f97316", // Orange
    "#eab308", // Yellow
    "#22c55e", // Green
    "#14b8a6", // Teal
    "#0ea5e9", // Sky
    "#6b7280", // Gray
];

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

    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryColor, setNewCategoryColor] = useState(CATEGORY_COLORS[0]);
    const [editingTitle, setEditingTitle] = useState(false);
    const [titleValue, setTitleValue] = useState("");

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
            title: "Untitled",
            content: "{}",
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

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;
        await createCategory({ name: newCategoryName.trim(), color: newCategoryColor });
        setNewCategoryName("");
        setNewCategoryColor(CATEGORY_COLORS[0]);
        setShowCategoryModal(false);
    };

    const handleDeleteNote = async (note: Note) => {
        if (confirm("Are you sure you want to delete this note?")) {
            await deleteNote(note.id);
            if (selectedNote?.id === note.id) {
                selectNote(null);
            }
        }
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] gap-4 p-6">
            {/* Sidebar */}
            <div className="w-72 flex flex-col gap-4">
                {/* Create Note Button */}
                <Button onClick={handleCreateNote} className="w-full">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Note
                </Button>

                {/* Categories */}
                <Card className="flex-shrink-0">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-sm text-[var(--foreground)]">Categories</h3>
                        <button
                            onClick={() => setShowCategoryModal(true)}
                            className="p-1 rounded hover:bg-[var(--muted)] transition-colors"
                            title="Add category"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                    <div className="space-y-1">
                        <button
                            onClick={() => selectCategory(null)}
                            className={cn(
                                "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                                !selectedCategoryId
                                    ? "bg-primary-400/10 text-primary-400"
                                    : "hover:bg-[var(--muted)] text-[var(--muted-foreground)]"
                            )}
                        >
                            <span className="w-3 h-3 rounded-full bg-[var(--muted-foreground)]" />
                            All Notes
                            <span className="ml-auto text-xs">{notes.length}</span>
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => selectCategory(category.id)}
                                className={cn(
                                    "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors group",
                                    selectedCategoryId === category.id
                                        ? "bg-primary-400/10 text-primary-400"
                                        : "hover:bg-[var(--muted)] text-[var(--muted-foreground)]"
                                )}
                            >
                                <span
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: category.color }}
                                />
                                <span className="truncate">{category.name}</span>
                                <span className="ml-auto text-xs">{category._count?.notes || 0}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm("Delete this category?")) {
                                            deleteCategory(category.id);
                                        }
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-[var(--destructive)]"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Notes List */}
                <div className="flex-1 overflow-auto space-y-2">
                    {isLoading ? (
                        <div className="text-center py-4 text-[var(--muted-foreground)]">Loading...</div>
                    ) : notes.length === 0 ? (
                        <div className="text-center py-4 text-[var(--muted-foreground)]">
                            No notes yet. Create one!
                        </div>
                    ) : (
                        notes.map((note) => (
                            <div
                                key={note.id}
                                onClick={() => selectNote(note)}
                                className={cn(
                                    "p-3 rounded-lg border cursor-pointer transition-all group",
                                    selectedNote?.id === note.id
                                        ? "border-primary-400 bg-primary-400/5"
                                        : "border-[var(--border)] hover:border-primary-400/50"
                                )}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-sm truncate text-[var(--foreground)]">
                                            {note.title}
                                        </h4>
                                        <p className="text-xs text-[var(--muted-foreground)] mt-1">
                                            {new Date(note.updatedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteNote(note);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-[var(--destructive)] transition-opacity"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                                {note.category && (
                                    <span
                                        className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded text-xs"
                                        style={{ backgroundColor: `${note.category.color}20`, color: note.category.color }}
                                    >
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: note.category.color }} />
                                        {note.category.name}
                                    </span>
                                )}
                            </div>
                        ))
                    )}
                </div>
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

            {/* Category Modal */}
            <Modal isOpen={showCategoryModal} onClose={() => setShowCategoryModal(false)} title="Create Category">
                <div className="space-y-4">
                    <Input
                        label="Category Name"
                        placeholder="e.g., Work, Personal, Ideas..."
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Color</label>
                        <div className="flex gap-2 flex-wrap">
                            {CATEGORY_COLORS.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => setNewCategoryColor(color)}
                                    className={cn(
                                        "w-8 h-8 rounded-full transition-transform",
                                        newCategoryColor === color && "ring-2 ring-offset-2 ring-primary-400 scale-110"
                                    )}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <Button variant="secondary" onClick={() => setShowCategoryModal(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateCategory} disabled={!newCategoryName.trim()}>
                            Create
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
