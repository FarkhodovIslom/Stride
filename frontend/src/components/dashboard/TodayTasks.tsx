"use client";

import { Card, EmptyState, Checkbox } from "@/components/ui";
import type { Lesson } from "@/types";
import Link from "next/link";
import { CheckCircle, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TodayTasksProps {
  tasks: Lesson[];
  onToggleComplete?: (id: string, courseId: string) => void;
  completingTasks?: Set<string>;
}

export default function TodayTasks({ tasks, onToggleComplete, completingTasks }: TodayTasksProps) {
  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Card>
          <h3 className="font-semibold text-[var(--foreground)] mb-4">
            Today&apos;s Tasks
          </h3>
          <EmptyState
            icon={<CheckCircle className="w-10 h-10 text-green-500" aria-hidden="true" />}
            title="All caught up!"
            description="You have no pending tasks. Add new lessons to continue learning."
          />
          <Link
            href="/courses"
            className="mt-4 inline-flex items-center gap-2 text-primary-400 hover:text-primary-500 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Browse courses to add lessons</span>
          </Link>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
    >
      <Card
        role="region"
        aria-label={`Today's tasks: ${tasks.length} remaining`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[var(--foreground)]" id="today-tasks-heading">
            Today&apos;s Tasks
          </h3>
          <span
            className="text-sm text-[var(--muted-foreground)]"
            aria-live="polite"
          >
            {tasks.length} remaining
          </span>
        </div>
        <ul
          className="space-y-3"
          role="list"
          aria-labelledby="today-tasks-heading"
        >
          <AnimatePresence mode="popLayout">
            {tasks.map((task, index) => {
              const isCompleting = completingTasks?.has(task.id);
              return (
                <motion.li
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50, height: 0, transition: { duration: 0.3 } }}
                  transition={{
                    duration: 0.2,
                    delay: index * 0.05,
                  }}
                  layout
                >
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg bg-[var(--muted)]/50 hover:bg-[var(--muted)] transition-all group ${isCompleting ? "opacity-50" : ""
                      }`}
                    role="listitem"
                    aria-busy={isCompleting}
                  >
                    <Checkbox
                      checked={task.completed}
                      onChange={() => onToggleComplete?.(task.id, task.courseId)}
                      disabled={isCompleting}
                      id={`task-${task.id}`}
                      aria-label={`Mark "${task.title}" as complete`}
                    />
                    <Link
                      href={`/courses/${task.courseId}`}
                      className="flex-1 text-sm text-[var(--foreground)] hover:text-primary-400 transition-colors"
                      aria-describedby={`task-status-${task.id}`}
                    >
                      <span className="group-hover:underline">{task.title}</span>
                      {isCompleting && (
                        <motion.span
                          className="ml-2 text-xs text-[var(--muted-foreground)]"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          aria-live="polite"
                        >
                          (Completing...)
                        </motion.span>
                      )}
                    </Link>
                    <span
                      id={`task-status-${task.id}`}
                      className={`text-xs px-2 py-1 rounded-full ${task.status === "progress"
                        ? "bg-blue-500/10 text-blue-500"
                        : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                        }`}
                    >
                      {task.status === "progress" ? "In Progress" : "Planned"}
                    </span>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
        {/* Screen reader announcement for task completion */}
        <div role="status" aria-live="polite" className="sr-only">
          {completingTasks && completingTasks.size > 0 && "Completing task..."}
        </div>
      </Card>
    </motion.div>
  );
}
