"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, ProgressBar, Skeleton, EmptyState } from "@/components/ui";
import KanbanBoard from "@/components/lessons/KanbanBoard";
import AddLessonForm from "@/components/lessons/AddLessonForm";
import CourseForm from "@/components/courses/CourseForm";
import DeleteConfirmModal from "@/components/courses/DeleteConfirmModal";
import { useLessonsStore } from "@/store/useLessonsStore";
import { calculateProgress } from "@/lib/utils";
import type { Course, LessonStatus } from "@/types";
import { Search, FileText } from "lucide-react";
import apiClient from "@/lib/api";

interface CoursePageProps {
  params: Promise<{ id: string }>;
}

export default function CoursePage({ params }: CoursePageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { lessons, fetchLessons, addLesson, moveLesson, toggleCompleted, deleteLesson } =
    useLessonsStore();

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const courseLessons = lessons[id] || [];
  const completedCount = courseLessons.filter((l) => l.completed).length;
  const progress = calculateProgress(completedCount, courseLessons.length);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await apiClient.get<{ course: Course }>(`/courses/${id}`, true);
        setCourse(data.course);
      } catch (error) {
        console.error("Failed to fetch course:", error);
        router.push("/courses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
    fetchLessons(id);
  }, [id, fetchLessons, router]);

  const handleAddLesson = async (title: string) => {
    await addLesson({ title, courseId: id });
  };

  const handleMoveLesson = async (lessonId: string, newStatus: LessonStatus) => {
    await moveLesson(lessonId, id, newStatus);
  };

  const handleToggleComplete = async (lessonId: string) => {
    await toggleCompleted(lessonId, id);
  };

  const handleDeleteLesson = async (lessonId: string) => {
    await deleteLesson(lessonId, id);
  };

  const handleEditCourse = async (data: { title: string; description: string }) => {
    try {
      const result = await apiClient.put<{ course: Course }>(`/courses/${id}`, data, true);
      setCourse(result.course);
    } catch (error) {
      console.error("Failed to update course:", error);
    }
  };

  const handleDeleteCourse = async () => {
    try {
      await apiClient.delete(`/courses/${id}`, true);
      router.push("/courses");
    } catch (error) {
      console.error("Failed to delete course:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-2 w-full" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <EmptyState
        icon={<Search className="w-16 h-16 text-muted-foreground" />}
        title="Course not found"
        description="The course you're looking for doesn't exist or has been deleted."
        action={{
          label: "Back to Courses",
          onClick: () => router.push("/courses"),
        }}
      />
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-6">
        <Link href="/courses" className="hover:text-primary-400 transition-colors">
          Courses
        </Link>
        <span>/</span>
        <span className="text-[var(--foreground)]">{course.title}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
            {course.title}
          </h1>
          {course.description && (
            <p className="text-[var(--muted-foreground)]">{course.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setIsEditOpen(true)}>
            <svg
              className="w-4 h-4 mr-2"
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
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteOpen(true)}>
            <svg
              className="w-4 h-4 mr-2"
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
            Delete
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8 p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[var(--muted-foreground)]">Course Progress</span>
          <span className="text-sm font-medium text-[var(--foreground)]">
            {completedCount} / {courseLessons.length} lessons
          </span>
        </div>
        <ProgressBar value={progress} size="md" />
        <p className="text-right text-sm font-bold text-primary-400 mt-2">
          {progress}% Complete
        </p>
      </div>

      {/* Add Lesson Form */}
      <div className="mb-6">
        <AddLessonForm onAdd={handleAddLesson} />
      </div>

      {/* Kanban Board */}
      {courseLessons.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-16 h-16 text-primary-400" />}
          title="No lessons yet"
          description="Add your first lesson to start organizing your learning."
        />
      ) : (
        <KanbanBoard
          lessons={courseLessons}
          onMoveLesson={handleMoveLesson}
          onToggleComplete={handleToggleComplete}
          onDeleteLesson={handleDeleteLesson}
        />
      )}

      {/* Edit Modal */}
      <CourseForm
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleEditCourse}
        course={course}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteCourse}
        title="Delete Course"
        message={`Are you sure you want to delete "${course.title}"? This will also delete all ${courseLessons.length} lessons. This action cannot be undone.`}
      />
    </div>
  );
}
