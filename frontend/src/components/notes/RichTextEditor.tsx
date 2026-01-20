"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import TextAlign from "@tiptap/extension-text-align";
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
    // Safe JSON parse helper with fallback
    const safeParseContent = (jsonString: string | undefined) => {
        if (!jsonString) return undefined;
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            console.error("Failed to parse note content:", error);
            // Return empty document structure as fallback
            return { type: "doc", content: [{ type: "paragraph" }] };
        }
    };

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
            Underline,
            HorizontalRule,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: safeParseContent(content),
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
                const parsedContent = safeParseContent(content);
                if (parsedContent) {
                    editor.commands.setContent(parsedContent);
                }
            }
        }
    }, [content, editor]);

    if (!editor) return null;

    return (
        <div className={cn("rich-text-editor", className)}>
            {/* Toolbar */}
            {editable && (
                <div className="flex flex-wrap gap-1 p-2 border-b border-[var(--border)] bg-[var(--muted)]/50">
                    {/* Undo/Redo */}
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        className={cn(
                            "p-2 rounded hover:bg-[var(--muted)] transition-colors",
                            !editor.can().undo() && "opacity-50 cursor-not-allowed"
                        )}
                        title="Undo (Ctrl+Z)"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        className={cn(
                            "p-2 rounded hover:bg-[var(--muted)] transition-colors",
                            !editor.can().redo() && "opacity-50 cursor-not-allowed"
                        )}
                        title="Redo (Ctrl+Shift+Z)"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                        </svg>
                    </button>

                    <div className="w-px bg-[var(--border)] mx-1" />

                    {/* Text Formatting */}
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={cn(
                            "p-2 rounded hover:bg-[var(--muted)] transition-colors",
                            editor.isActive("bold") && "bg-[var(--muted)] text-primary-400"
                        )}
                        title="Bold (Ctrl+B)"
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
                        title="Italic (Ctrl+I)"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4h4m-2 0v16m-4 0h8" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={cn(
                            "p-2 rounded hover:bg-[var(--muted)] transition-colors",
                            editor.isActive("underline") && "bg-[var(--muted)] text-primary-400"
                        )}
                        title="Underline (Ctrl+U)"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 20h14M6 4v8a4 4 0 008 0V4" />
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
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHighlight().run()}
                        className={cn(
                            "p-2 rounded hover:bg-[var(--muted)] transition-colors",
                            editor.isActive("highlight") && "bg-[var(--muted)] text-primary-400"
                        )}
                        title="Highlight"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7l3-3 3 3zM5 4l3-3 6 6-3 3-6-6z" />
                        </svg>
                    </button>

                    <div className="w-px bg-[var(--border)] mx-1" />

                    {/* Headings */}
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

                    {/* Lists */}
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

                    {/* Blocks */}
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
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        className="p-2 rounded hover:bg-[var(--muted)] transition-colors"
                        title="Horizontal Rule"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16" />
                        </svg>
                    </button>

                    <div className="w-px bg-[var(--border)] mx-1" />

                    {/* Text Alignment */}
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        className={cn(
                            "p-2 rounded hover:bg-[var(--muted)] transition-colors",
                            editor.isActive({ textAlign: 'left' }) && "bg-[var(--muted)] text-primary-400"
                        )}
                        title="Align Left"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h14" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        className={cn(
                            "p-2 rounded hover:bg-[var(--muted)] transition-colors",
                            editor.isActive({ textAlign: 'center' }) && "bg-[var(--muted)] text-primary-400"
                        )}
                        title="Align Center"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M5 18h14" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        className={cn(
                            "p-2 rounded hover:bg-[var(--muted)] transition-colors",
                            editor.isActive({ textAlign: 'right' }) && "bg-[var(--muted)] text-primary-400"
                        )}
                        title="Align Right"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M6 18h14" />
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
