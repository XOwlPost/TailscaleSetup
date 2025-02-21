import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface GridItemProps {
  children: React.ReactNode;
  className?: string;
}

export function GridItem({ children, className = "" }: GridItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: (children as any).key,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "w-full transition-all touch-none select-none",
        isDragging && "z-50",
        className
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ 
            opacity: 1, 
            scale: isDragging ? 1.05 : 1,
            y: 0,
            boxShadow: isDragging 
              ? "0 20px 40px rgba(0,0,0,0.12)" 
              : "0 4px 12px rgba(0,0,0,0.05)",
            rotate: isDragging ? [-0.5, 0.5] : 0,
          }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ 
            duration: 0.2,
            rotate: {
              repeat: isDragging ? Infinity : 0,
              duration: 0.5,
            }
          }}
          className="h-full w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}