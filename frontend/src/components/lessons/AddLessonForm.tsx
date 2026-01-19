"use client";

import { useState } from "react";
import { Button, Input, DateTimePicker } from "@/components/ui";

interface AddLessonFormProps {
  onAdd: (title: string, dueDate?: string) => Promise<void>;
}

export default function AddLessonForm({ onAdd }: AddLessonFormProps) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      await onAdd(title.trim(), dueDate || undefined);
      setTitle("");
      setDueDate(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-center flex-wrap">
      <Input
        placeholder="Add a new lesson..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 min-w-[200px]"
      />
      <DateTimePicker
        value={dueDate || undefined}
        onChange={(val) => setDueDate(val)}
        placeholder="Deadline (optional)"
      />
      <Button type="submit" isLoading={isLoading} disabled={!title.trim()}>
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
        Add Lesson
      </Button>
    </form>
  );
}

