"use client";

import { useState } from "react";
import { Button, Input, Modal } from "@/components/ui";
import type { Course } from "@/types";

interface CourseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string }) => Promise<void>;
  course?: Course | null;
}

export default function CourseForm({
  isOpen,
  onClose,
  onSubmit,
  course,
}: CourseFormProps) {
  const [title, setTitle] = useState(course?.title || "");
  const [description, setDescription] = useState(course?.description || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!course;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Course title is required");
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({ title: title.trim(), description: description.trim() });
      setTitle("");
      setDescription("");
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTitle(course?.title || "");
    setDescription(course?.description || "");
    setError("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? "Edit Course" : "Create New Course"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="title"
          label="Course Title"
          placeholder="e.g., React Fundamentals"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={error && !title.trim() ? error : undefined}
          autoFocus
        />

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-[var(--foreground)] mb-1.5"
          >
            Description (optional)
          </label>
          <textarea
            id="description"
            rows={3}
            placeholder="Brief description of the course..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-primary-400/20 focus:border-primary-400 transition-all resize-none"
          />
        </div>

        {error && title.trim() && (
          <p className="text-sm text-[var(--destructive)]">{error}</p>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading} className="flex-1">
            {isEditing ? "Save Changes" : "Create Course"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
