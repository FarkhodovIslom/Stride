"use client";

import { useEffect, useState } from "react";
import { Button, EmptyState, CardSkeleton } from "@/components/ui";
import CourseCard from "@/components/courses/CourseCard";
import CourseForm from "@/components/courses/CourseForm";
import DeleteConfirmModal from "@/components/courses/DeleteConfirmModal";
import { useCoursesStore } from "@/store/useCoursesStore";
import type { Course } from "@/types";
import { BookOpen } from "lucide-react";

export default function CoursesPage() {
  const { courses, isLoading, fetchCourses, addCourse, updateCourse, deleteCourse } =
    useCoursesStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleCreate = async (data: { title: string; description: string }) => {
    await addCourse(data);
  };

  const handleEdit = async (data: { title: string; description: string }) => {
    if (editingCourse) {
      await updateCourse(editingCourse.id, data);
    }
  };

  const handleDelete = async () => {
    if (deletingCourse) {
      await deleteCourse(deletingCourse.id);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            My Courses
          </h1>
          <p className="text-[var(--muted-foreground)] mt-1">
            Manage your learning journey
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Course
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : courses.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-16 h-16 text-primary-400" />}
          title="No courses yet"
          description="Create your first course to start tracking your learning progress."
          action={{
            label: "Create Course",
            onClick: () => setIsFormOpen(true),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={() => {
                setEditingCourse(course);
                setIsFormOpen(true);
              }}
              onDelete={() => setDeletingCourse(course)}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <CourseForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCourse(null);
        }}
        onSubmit={editingCourse ? handleEdit : handleCreate}
        course={editingCourse}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingCourse}
        onClose={() => setDeletingCourse(null)}
        onConfirm={handleDelete}
        title="Delete Course"
        message={`Are you sure you want to delete "${deletingCourse?.title}"? This will also delete all lessons in this course. This action cannot be undone.`}
      />
    </div>
  );
}
