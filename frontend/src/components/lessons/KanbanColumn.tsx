"use client";

import { Droppable, Draggable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import type { Lesson, LessonStatus } from "@/types";

interface KanbanColumnProps {
  id: LessonStatus;
  title: string;
  lessons: Lesson[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const statusColors = {
  planned: "border-t-gray-400",
  progress: "border-t-blue-500",
  completed: "border-t-green-500",
};

const statusBadges = {
  planned: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  progress: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

function formatDueDate(dueDate: Date | string | null | undefined) {
  if (!dueDate) return null;

  const date = new Date(dueDate);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isToday = date.toDateString() === now.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();
  const isPast = date < now && !isToday;

  // Format time (e.g., "2:30 PM")
  const timeStr = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  let display = "";
  if (isToday) display = `Today, ${timeStr}`;
  else if (isTomorrow) display = `Tomorrow, ${timeStr}`;
  else display = `${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${timeStr}`;

  return { display, isPast, isToday };
}

export default function KanbanColumn({
  id,
  title,
  lessons,
  onToggleComplete,
  onDelete,
}: KanbanColumnProps) {
  return (
    <div
      className={cn(
        "flex flex-col bg-[var(--muted)]/30 rounded-xl border border-[var(--border)] border-t-4",
        statusColors[id]
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-[var(--foreground)]">{title}</h3>
          <span
            className={cn(
              "text-xs px-2 py-0.5 rounded-full font-medium",
              statusBadges[id]
            )}
          >
            {lessons.length}
          </span>
        </div>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 p-3 space-y-2 min-h-[200px] transition-colors",
              snapshot.isDraggingOver && "bg-primary-400/5"
            )}
          >
            {lessons.map((lesson, index) => {
              const dueDateInfo = formatDueDate(lesson.dueDate);

              return (
                <Draggable key={lesson.id} draggableId={lesson.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={cn(
                        "group flex flex-col gap-2 p-3 rounded-lg border border-[var(--border)] bg-[var(--card)]",
                        "transition-all duration-200 cursor-grab active:cursor-grabbing",
                        snapshot.isDragging && "shadow-lg ring-2 ring-primary-400 rotate-2",
                        lesson.completed && "opacity-60"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={lesson.completed}
                          onChange={() => onToggleComplete(lesson.id)}
                          className="w-4 h-4 rounded border-[var(--border)] text-primary-400 focus:ring-primary-400 cursor-pointer"
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
                          onClick={() => onDelete(lesson.id)}
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

                      {dueDateInfo && !lesson.completed && (
                        <span
                          className={cn(
                            "flex items-center gap-1 text-xs ml-7",
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
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}

            {lessons.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex items-center justify-center h-20 text-sm text-[var(--muted-foreground)] border-2 border-dashed border-[var(--border)] rounded-lg">
                Drop lessons here
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}

