"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { createPortal } from "react-dom";
import { Task, Column } from "../types";
import KanbanColumn from "./KanbanColumn";
import SortableCard from "./KanbanCard";
import { generateCards } from "@/utils/generateCards";

const initialData: Column[] = [
  {
    id: "todo",
    title: "To Do",
    tasks: generateCards(500, "todo"),
  },
  {
    id: "in-progress",
    title: "In Progress",
    tasks: generateCards(12302, "in-progress"),
  },
  {
    id: "done",
    title: "Done",
    tasks: generateCards(12231, "done"),
  },
];

const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>(initialData);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // 1. Function called when dragging starts
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeId = active.id;

    // Find the column containing the active task
    const sourceColumn = columns.find((column) =>
      column.tasks.some((task) => task.id === activeId)
    );
    if (!sourceColumn) return;

    // Set the active task for the DragOverlay
    const task = sourceColumn.tasks.find((task) => task.id === activeId);
    setActiveTask(task || null);
  };

  // 2. Function called while the item is being dragged
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find the source column and the target column
    const sourceColumn = columns.find((column) =>
      column.tasks.some((task) => task.id === activeId)
    );
    const targetColumn = columns.find((column) => column.id === overId);

    // If moving within the same column, skip this logic
    if (!sourceColumn || !targetColumn || sourceColumn === targetColumn) return;

    // Find the index of the active task in the source column
    const sourceIndex = sourceColumn.tasks.findIndex(
      (task) => task.id === activeId
    );

    // Remove the task from the source column
    const [movedTask] = sourceColumn.tasks.splice(sourceIndex, 1);

    // Add the task to the target column
    targetColumn.tasks.push(movedTask);
    setColumns([...columns]);
  };

  // 3. Function called when dragging ends
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null); // Clear the active task if dropped outside a valid area
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    // Locate the source column and the target column
    const sourceColumn = columns.find((column) =>
      column.tasks.some((task) => task.id === activeId)
    );
    const targetColumn = columns.find(
      (column) =>
        column.id === overId || column.tasks.some((task) => task.id === overId)
    );

    if (!sourceColumn || !targetColumn) return;

    // Index of the dragged task in the source column
    const sourceIndex = sourceColumn.tasks.findIndex(
      (task) => task.id === activeId
    );

    // Index of the task over which the dragged item was dropped
    const targetIndex = targetColumn.tasks.findIndex(
      (task) => task.id === overId
    );

    // Remove the dragged task from the source column
    const [movedTask] = sourceColumn.tasks.splice(sourceIndex, 1);

    if (sourceColumn === targetColumn) {
      // Reorder within the same column
      const adjustedIndex =
        sourceIndex < targetIndex ? targetIndex : targetIndex;

      targetColumn.tasks.splice(adjustedIndex, 0, movedTask);
    } else {
      // Move to a different column
      targetColumn.tasks.splice(targetIndex + 1, 0, movedTask);
    }

    // Update the state with the new column structure
    setColumns([...columns]);
    setActiveTask(null); // Clear the active task
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex overflow-x-auto p-4 space-x-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            tasks={column.tasks}
          />
        ))}
      </div>

      {createPortal(
        <DragOverlay>
          {activeTask && (
            <SortableCard id={activeTask.id} title={activeTask.title} />
          )}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};

export default KanbanBoard;
