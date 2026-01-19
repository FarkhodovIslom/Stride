"use client";

import { useNotesStore } from "@/store/useNotesStore";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

interface NoteHistoryDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function NoteHistoryDrawer({ isOpen, onClose }: NoteHistoryDrawerProps) {
    const { selectedNote, versions, fetchVersions, restoreVersion } = useNotesStore();

    useEffect(() => {
        if (isOpen && selectedNote) {
            fetchVersions(selectedNote.id);
        }
    }, [isOpen, selectedNote, fetchVersions]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-80 bg-[var(--card)] border-l border-[var(--border)] shadow-xl transform transition-transform duration-300 p-4 z-50 flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-[var(--border)]">
                <h3 className="font-semibold text-lg text-[var(--foreground)]">Version History</h3>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-[var(--muted)] rounded text-[var(--muted-foreground)]"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
                {versions.length === 0 ? (
                    <div className="text-center text-[var(--muted-foreground)] py-8">
                        No history available.
                    </div>
                ) : (
                    versions.map((version) => (
                        <div key={version.id} className="p-3 rounded-lg border border-[var(--border)] bg-[var(--background)]">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs text-[var(--muted-foreground)]">
                                    {new Date(version.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <div className="text-xs text-[var(--muted-foreground)] line-clamp-3 mb-3 font-mono bg-[var(--muted)] p-1 rounded">
                                {version.content.substring(0, 100)}...
                            </div>
                            <Button
                                size="sm"
                                variant="secondary"
                                className="w-full text-xs h-7"
                                onClick={async () => {
                                    if (confirm("Restore this version? current content will be saved as a new version.")) {
                                        if (selectedNote) {
                                            await restoreVersion(selectedNote.id, version.id);
                                            onClose();
                                        }
                                    }
                                }}
                            >
                                Restore
                            </Button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
