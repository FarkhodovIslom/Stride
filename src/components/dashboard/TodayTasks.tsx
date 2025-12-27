"use client";

import { Card, EmptyState, Checkbox } from "@/components/ui";
import type { Lesson } from "@/types";
import Link from "next/link";

interface TodayTasksProps {
  tasks: Lesson[];
  onToggleComplete?: (id: string, courseId: string) => void;
}

export default function TodayTasks({ tasks, onToggleComplete }: TodayTasksProps) {
  if (tasks.length === 0) {
    return (
      <Card>
        <h3 className="font-semibold text-[var(--foreground)] mb-4">
          Today&apos;s Tasks
        </h3>
        <EmptyState
          icon={<span className="text-4xl">✅</span>}
          title="All caught up!"
          description="You have no pending tasks. Add new lessons to continue learning."
        />
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[var(--foreground)]">
          Today&apos;s Tasks
        </h3>
        <span className="text-sm text-[var(--muted-foreground)]">
          {tasks.length} remaining
        </span>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-[var(--muted)]/50 hover:bg-[var(--muted)] transition-colors"
          >
            <Checkbox
              checked={task.completed}
              onChange={() => onToggleComplete?.(task.id, task.courseId)}
            />
            <Link
              href={`/courses/${task.courseId}`}
              className="flex-1 text-sm text-[var(--foreground)] hover:text-primary-400 transition-colors"
            >
              {task.title}
            </Link>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                task.status === "progress"
                  ? "bg-blue-500/10 text-blue-500"
                  : "bg-[var(--muted)] text-[var(--muted-foreground)]"
              }`}
            >
              {task.status === "progress" ? "In Progress" : "Planned"}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
