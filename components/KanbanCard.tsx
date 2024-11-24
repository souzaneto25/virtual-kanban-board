import { useSortable } from "@dnd-kit/sortable";
import React from "react";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/types";

interface KanbanCardProps {
  title: string;
}

const KanbanCard = ({ title }: KanbanCardProps) => {
  return <div className="p-3 mb-2 bg-white rounded shadow-md">{title}</div>;
};

const SortableCard = ({ id, title }: Task) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={{
          ...style,
        }}
        className="w-full bg-white dark:bg-black rounded-md cursor-pointer relative p-3 opacity-40 border border-gray-500 min-h-[64px]"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="p-3 mb-2 bg-white rounded shadow-md cursor-grab min-h-[64px]"
    >
      <KanbanCard title={title} />
    </div>
  );
};

export default SortableCard;
