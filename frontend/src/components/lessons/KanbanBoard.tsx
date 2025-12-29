"use client";

import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import KanbanColumn from "./KanbanColumn";
import type { Lesson, LessonStatus } from "@/types";

interface KanbanBoardProps {
  lessons: Lesson[];
  onMoveLesson: (id: string, newStatus: LessonStatus) => void;
  onToggleComplete: (id: string) => void;
  onDeleteLesson: (id: string) => void;
}

const columns: { id: LessonStatus; title: string }[] = [
  { id: "planned", title: "Planned" },
  { id: "progress", title: "In Progress" },
  { id: "completed", title: "Completed" },
];

export default function KanbanBoard({
  lessons,
  onMoveLesson,
  onToggleComplete,
  onDeleteLesson,
}: KanbanBoardProps) {
  const getLessonsByStatus = (status: LessonStatus) =>
    lessons.filter((l) => l.status === status);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceStatus = result.source.droppableId as LessonStatus;
    const destStatus = result.destination.droppableId as LessonStatus;

    if (sourceStatus !== destStatus) {
      onMoveLesson(result.draggableId, destStatus);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            lessons={getLessonsByStatus(column.id)}
            onToggleComplete={onToggleComplete}
            onDelete={onDeleteLesson}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
