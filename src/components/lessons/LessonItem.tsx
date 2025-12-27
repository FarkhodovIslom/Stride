"use client";

import { Checkbox } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Lesson } from "@/types";

interface LessonItemProps {
  lesson: Lesson;
  onToggleComplete: () => void;
  onDelete: () => void;
  isDragging?: boolean;
}

export default function LessonItem({
  lesson,
  onToggleComplete,
  onDelete,
  isDragging,
}: LessonItemProps) {
  return (
    <div
      className={cn(
        "group flex items-center gap-3 p-3 rounded-lg border border-[var(--border)] bg-[var(--card)]",
        "transition-all duration-200",
        isDragging && "shadow-lg ring-2 ring-primary-400",
        lesson.completed && "opacity-60"
      )}
    >
      <Checkbox
        checked={lesson.completed}
        onChange={onToggleComplete}
        aria-label={`Mark "${lesson.title}" as ${lesson.completed ? "incomplete" : "complete"}`}
      />
      <span
        className={cn(
          "flex-1 text-sm text-[var(--foreground)]",
          lesson.completed && "line-through text-[var(--muted-foreground)]"
        )}
      >
        {lesson.title}
      </span>
      <button
        onClick={onDelete}
        className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-[var(--destructive)]/10 transition-all"
        aria-label="Delete lesson"
      >
        <svg
          className="w-4 h-4 text-[var(--destructive)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
