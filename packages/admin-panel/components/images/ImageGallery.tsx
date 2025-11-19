import {
  DndContext,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import type { Accept } from "react-dropzone";
import ImageDropzone from "./ImageDropzone";
import ImageSortableItem from "./ImageSortableItem";
import type { ImageItem } from "./types";
import React from "react";

type Props = {
  items: ImageItem[];
  onItemsChange: (next: ImageItem[]) => void;
  onFilesAdded: (files: File[]) => void;
  accept?: Accept;
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
};

export default function ImageGallery({
  items,
  onItemsChange,
  onFilesAdded,
  accept = { "image/*": [] },
  maxFiles = 20,
  disabled = false,
  className = "",
}: Props) {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 120, tolerance: 5 },
    }),
    useSensor(KeyboardSensor),
  );

  const reorderWithOrder = React.useCallback((list: ImageItem[]) => {
    return list.map((it, idx) => ({ ...it, order: idx }));
  }, []);

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = items.findIndex((i) => i.id === String(active.id));
      const newIndex = items.findIndex((i) => i.id === String(over.id));
      if (oldIndex < 0 || newIndex < 0) return;

      const moved = arrayMove(items, oldIndex, newIndex);
      onItemsChange(reorderWithOrder(moved));
    },
    [items, onItemsChange, reorderWithOrder],
  );

  const handleRemove = React.useCallback(
    (id: string) => {
      const next = items.filter((i) => i.id !== id);
      onItemsChange(reorderWithOrder(next));
    },
    [items, onItemsChange, reorderWithOrder],
  );

  return (
    <div className={className}>
      <DndContext
        sensors={sensors}
        modifiers={[restrictToParentElement]}
        onDragEnd={handleDragEnd}
      >
        <div className="relative">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <ImageDropzone
              onFilesAdded={onFilesAdded}
              accept={accept}
              maxFiles={maxFiles}
              disabled={disabled}
              className={""}
            />
            <SortableContext
              items={items.map((i) => i.id)}
              strategy={rectSortingStrategy}
            >
              {items.map((item) => (
                <ImageSortableItem
                  key={item.id}
                  item={item}
                  onRemove={handleRemove}
                />
              ))}
            </SortableContext>
          </div>
        </div>
      </DndContext>
    </div>
  );
}
