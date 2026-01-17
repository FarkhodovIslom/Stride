"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Highlight from "@tiptap/extension-highlight";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    className?: string;
    editable?: boolean;
}

export default function RichTextEditor({
    content,
    onChange,
    placeholder = "Start writing...",
    className,
    editable = true,
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
            Link.configure({
                openOnClick: false,
            }),
            Placeholder.configure({
                placeholder,
            }),
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            Highlight,
        ],
        content: content ? JSON.parse(content) : undefined,
        editable,
        onUpdate: ({ editor }) => {
            onChange(JSON.stringify(editor.getJSON()));
        },
        immediatelyRender: false,
    });

    useEffect(() => {
        if (editor && content) {
            const currentContent = JSON.stringify(editor.getJSON());
            if (currentContent !== content) {
                editor.commands.setContent(JSON.parse(content));
            }
        }
    }, [content, editor]);

    if (!editor) return null;

    return (
        <div className={cn("rich-text-editor", className)}>
            {/* Toolbar */}
            {editable && (
                <div className="flex flex-wrap gap-1 p-2 border-b border-[var(--border)] bg-[var(--muted)]/50">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={cn(
                            "p-2 rounded hover:bg-[var(--muted)] transition-colors",
                            editor.isActive("bold") && "bg-[var(--muted)] text-primary-400"
                        )}
                        title="Bold"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6zm0 8h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={cn(
                            "p-2 rounded hover:bg-[var(--muted)] transition-colors",
                            editor.isActive("italic") && "bg-[var(--muted)] text-primary-400"
                        )}
                        title="Italic"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4h4m-2 0v16m-4 0h8" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={cn(
                            "p-2 rounded hover:bg-[var(--muted)] transition-colors",
                            editor.isActive("strike") && "bg-[var(--muted)] text-primary-400"
                        )}
                        title="Strikethrough"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5v14" />
                        </svg>
                    </button>

                    <div className="w-px bg-[var(--border)] mx-1" />

                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={cn(
                            "p-2 rounded hover:bg-[var(--muted)] transition-colors text-xs font-bold",
                            editor.isActive("heading", { level: 1 }) && "bg-[var(--muted)] text-primary-400"
                        )}
                        title="Heading 1"
                    >
                        H1
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={cn(
                            "p-2 rounded hover:bg-[var(--muted)] transition-colors text-xs font-bold",
                            editor.isActive("heading", { level: 2 }) && "bg-[var(--muted)] text-primary-400"
                        )}
                        title="Heading 2"
                    >
                        H2
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        className={cn(
                            "p-2 rounded hover:bg-[var(--muted)] transition-colors text-xs font-bold",
                            editor.isActive("heading", { level: 3 }) && "bg-[var(--muted)] text-primary-400"
                        )}
                        title="Heading 3"
                    >
                        H3
                    </button>

                    <div className="w-px bg-[var(--border)] mx-1" />

                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={cn(
                            "p-2 rounded hover:bg-[var(--muted)] transition-colors",
                            editor.isActive("bulletList") && "bg-[var(--muted)] text-primary-400"
                        )}
                        title="Bullet List"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={cn(
                            "p-2 rounded hover:bg-[var(--muted)] transition-colors",
                            editor.isActive("orderedList") && "bg-[var(--muted)] text-primary-400"
                        )}
                        title="Ordered List"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 6h14M7 12h14M7 18h14M3 6h.01M3 12h.01M3 18h.01" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleTaskList().run()}
                        className={cn(
                            "p-2 rounded hover:bg-[var(--muted)] transition-colors",
                            editor.isActive("taskList") && "bg-[var(--muted)] text-primary-400"
                        )}
                        title="Task List"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </button>

                    <div className="w-px bg-[var(--border)] mx-1" />

                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        className={cn(
                            "p-2 rounded hover:bg-[var(--muted)] transition-colors",
                            editor.isActive("codeBlock") && "bg-[var(--muted)] text-primary-400"
                        )}
                        title="Code Block"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={cn(
                            "p-2 rounded hover:bg-[var(--muted)] transition-colors",
                            editor.isActive("blockquote") && "bg-[var(--muted)] text-primary-400"
                        )}
                        title="Quote"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5 3.871 3.871 0 01-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5 3.871 3.871 0 01-2.748-1.179z" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Editor Content */}
            <EditorContent
                editor={editor}
                className={cn(
                    "prose prose-sm dark:prose-invert max-w-none p-4",
                    "[&_.ProseMirror]:min-h-[200px] [&_.ProseMirror]:outline-none",
                    "[&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
                    "[&_.ProseMirror_p.is-editor-empty:first-child::before]:text-[var(--muted-foreground)]",
                    "[&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left",
                    "[&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none",
                    "[&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0"
                )}
            />
        </div>
    );
}
