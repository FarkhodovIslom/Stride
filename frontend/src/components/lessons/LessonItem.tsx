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

function formatDueDate(dueDate: Date | string | null | undefined) {
  if (!dueDate) return null;

  const date = new Date(dueDate);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isToday = date.toDateString() === now.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();
  const isPast = date < now && !isToday;

  let display = "";
  if (isToday) display = "Today";
  else if (isTomorrow) display = "Tomorrow";
  else display = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return { display, isPast, isToday };
}

export default function LessonItem({
  lesson,
  onToggleComplete,
  onDelete,
  isDragging,
}: LessonItemProps) {
  const dueDateInfo = formatDueDate(lesson.dueDate);

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
      <div className="flex-1 min-w-0">
        <span
          className={cn(
            "block text-sm text-[var(--foreground)] truncate",
            lesson.completed && "line-through text-[var(--muted-foreground)]"
          )}
        >
          {lesson.title}
        </span>
        {dueDateInfo && !lesson.completed && (
          <span
            className={cn(
              "flex items-center gap-1 text-xs mt-0.5",
              dueDateInfo.isPast && "text-[var(--destructive)]",
              dueDateInfo.isToday && "text-amber-600 dark:text-amber-400",
              !dueDateInfo.isPast && !dueDateInfo.isToday && "text-[var(--muted-foreground)]"
            )}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {dueDateInfo.display}
            {dueDateInfo.isPast && " (Overdue)"}
          </span>
        )}
      </div>
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

