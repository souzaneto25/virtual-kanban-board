"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Column } from "../types";
import SortableCard from "./KanbanCard";
import { useVirtualizer } from "@tanstack/react-virtual";

const KanbanColumn = ({ id, title, tasks }: Column) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 90, // Altura estimada de cada item
    overscan: 5, // Renderizar itens extras fora do viewport
  });

  return (
    <div className="flex flex-col w-80 mx-2">
      <h3 className="mb-3 text-lg font-bold">{title}</h3>
      <div
        ref={setNodeRef}
        className="flex flex-col min-h-[600px] h-full bg-gray-100 rounded-lg p-3 shadow-md"
      >
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <div
            ref={parentRef}
            style={{ overflow: "auto", height: "600px" }}
            className="relative"
          >
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                position: "relative",
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const task = tasks[virtualRow.index];
                return (
                  <div
                    key={task.id}
                    ref={(el) => {
                      if (el) {
                        rowVirtualizer.measureElement(el);
                      }
                    }}
                    data-index={virtualRow.index}
                    style={{
                      position: "absolute",
                      top: `${virtualRow.start}px`,
                      width: "100%",
                    }}
                  >
                    <SortableCard id={task.id} title={task.title} />
                  </div>
                );
              })}
            </div>
          </div>
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;
