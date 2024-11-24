"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Column } from "../types";
import SortableCard from "./KanbanCard";

const KanbanColumn = ({ id, title, tasks }: Column) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div className="flex flex-col w-80 mx-2">
      <h3 className="mb-3 text-lg font-bold">{title}</h3>
      <div
        ref={setNodeRef}
        className="flex flex-col min-h-[600px] bg-gray-100 rounded-lg p-3 shadow-md"
      >
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <SortableCard key={task.id} id={task.id} title={task.title} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;

// Componente para um card que pode ser ordenado
