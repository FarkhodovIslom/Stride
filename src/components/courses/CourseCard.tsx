"use client";

import { Card, ProgressBar } from "@/components/ui";
import { formatDate, calculateProgress } from "@/lib/utils";
import Link from "next/link";
import type { Course, Lesson } from "@/types";

interface CourseCardProps {
  course: Course & { lessons?: Lesson[] };
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function CourseCard({ course, onEdit, onDelete }: CourseCardProps) {
  const lessons = course.lessons || [];
  const completedLessons = lessons.filter((l) => l.completed).length;
  const progress = calculateProgress(completedLessons, lessons.length);

  return (
    <Card hover className="group relative">
      <Link href={`/courses/${course.id}`} className="block">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-[var(--foreground)] group-hover:text-primary-400 transition-colors">
            {course.title}
          </h3>
          <span className="text-xs text-[var(--muted-foreground)]">
            {formatDate(course.createdAt)}
          </span>
        </div>

        {course.description && (
          <p className="text-sm text-[var(--muted-foreground)] mb-4 line-clamp-2">
            {course.description}
          </p>
        )}

        <div className="mb-3">
          <ProgressBar value={progress} size="sm" />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--muted-foreground)]">
            {completedLessons} / {lessons.length} lessons
          </span>
          <span className="font-medium text-primary-400">{progress}%</span>
        </div>
      </Link>

      {/* Actions */}
      <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.preventDefault();
            onEdit?.();
          }}
          className="p-1.5 rounded-lg hover:bg-[var(--muted)] transition-colors"
          aria-label="Edit course"
        >
          <svg
            className="w-4 h-4 text-[var(--muted-foreground)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            onDelete?.();
          }}
          className="p-1.5 rounded-lg hover:bg-[var(--destructive)]/10 transition-colors"
          aria-label="Delete course"
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </Card>
  );
}
