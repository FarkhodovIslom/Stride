"use client";

import { cn } from "@/lib/utils";
import type { Note } from "@/types";

interface NotesListProps {
    notes: Note[];
    selectedNoteId?: string;
    isLoading: boolean;
    onSelectNote: (note: Note) => void;
    onDeleteNote: (note: Note) => void;
}

export function NotesList({
    notes,
    selectedNoteId,
    isLoading,
    onSelectNote,
    onDeleteNote,
}: NotesListProps) {
    if (isLoading) {
        return <div className="text-center py-4 text-[var(--muted-foreground)]">Loading...</div>;
    }

    if (notes.length === 0) {
        return (
            <div className="text-center py-4 text-[var(--muted-foreground)]">
                No notes yet. Create one!
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-auto space-y-2">
            {notes.map((note) => (
                <div
                    key={note.id}
                    onClick={() => onSelectNote(note)}
                    className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-all group",
                        selectedNoteId === note.id
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
                                onDeleteNote(note);
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
            ))}
        </div>
    );
}
