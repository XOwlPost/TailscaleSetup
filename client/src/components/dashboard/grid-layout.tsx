import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useWindowSize } from "@/hooks/use-window-size";
import { type ReactNode } from "react";

interface GridLayoutProps {
  children: ReactNode[];
  className?: string;
  onReorder?: (values: ReactNode[]) => void;
}

export function GridLayout({ 
  children,
  className = "",
  onReorder
}: GridLayoutProps) {
  const { width } = useWindowSize();
  const [columns, setColumns] = useState(3);
  const [items, setItems] = useState(children);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Minimum drag distance before activation
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Update columns based on screen size
  useEffect(() => {
    if (width < 640) { // Mobile
      setColumns(1);
    } else if (width < 1024) { // Tablet
      setColumns(2);
    } else { // Desktop
      setColumns(3);
    }
  }, [width]);

  useEffect(() => {
    setItems(children);
  }, [children]);

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item: any) => item.key === active.id);
        const newIndex = items.findIndex((item: any) => item.key === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        onReorder?.(newItems);
        return newItems;
      });
    }
  }

  return (
    <div 
      className={`grid gap-6 ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        width: '100%'
      }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((item: any) => item.key)}
          strategy={verticalListSortingStrategy}
        >
          {items}
        </SortableContext>
      </DndContext>
    </div>
  );
}

export { GridItem } from "./grid-item";