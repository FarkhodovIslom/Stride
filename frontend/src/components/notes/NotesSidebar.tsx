"use client";

import { cn } from "@/lib/utils";
import { Button, Card, Modal, Input } from "@/components/ui";
import { NOTES_CATEGORY_COLORS } from "@/config/notes";
import type { Note, NoteCategory } from "@/types";
import { useState } from "react";

interface NotesSidebarProps {
    notes: Note[];
    categories: NoteCategory[];
    selectedCategoryId: string | null;
    onSelectCategory: (categoryId: string | null) => void;
    onCreateNote: () => void;
    onCreateCategory: (name: string, color: string) => Promise<void>;
    onDeleteCategory: (id: string) => void;
}

export function NotesSidebar({
    notes,
    categories,
    selectedCategoryId,
    onSelectCategory,
    onCreateNote,
    onCreateCategory,
    onDeleteCategory,
}: NotesSidebarProps) {
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryColor, setNewCategoryColor] = useState(NOTES_CATEGORY_COLORS[0]);

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;
        await onCreateCategory(newCategoryName.trim(), newCategoryColor);
        setNewCategoryName("");
        setNewCategoryColor(NOTES_CATEGORY_COLORS[0]);
        setShowCategoryModal(false);
    };

    return (
        <div className="w-72 flex flex-col gap-4">
            {/* Create Note Button */}
            <Button onClick={onCreateNote} className="w-full">
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
                        onClick={() => onSelectCategory(null)}
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
                            onClick={() => onSelectCategory(category.id)}
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
                                    onDeleteCategory(category.id);
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
                            {NOTES_CATEGORY_COLORS.map((color) => (
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
