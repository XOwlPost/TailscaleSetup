import { useEffect, useState } from "react";
import { motion, Reorder } from "framer-motion";
import { useWindowSize } from "@/hooks/use-window-size";

interface GridLayoutProps {
  children: React.ReactNode[];
  className?: string;
  onReorder?: (values: React.ReactNode[]) => void;
}

export function GridLayout({ 
  children,
  className = "",
  onReorder
}: GridLayoutProps) {
  const { width } = useWindowSize();
  const [columns, setColumns] = useState(3);

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

  return (
    <div 
      className={`grid gap-6 ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        width: '100%'
      }}
    >
      <Reorder.Group 
        axis="y"
        values={children}
        onReorder={onReorder}
        style={{ display: 'contents' }}
      >
        {children}
      </Reorder.Group>
    </div>
  );
}

export function GridItem({ 
  children,
  className = "" 
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Reorder.Item
      value={children}
      className={`w-full ${className}`}
      dragListener={true}
      dragControls
      dragMomentum={false}
    >
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        whileDrag={{ 
          scale: 1.02,
          zIndex: 50,
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          backgroundColor: "var(--background)",
          opacity: 1
        }}
        transition={{ 
          duration: 0.2,
          layout: { duration: 0.2 }
        }}
        className="h-full w-full cursor-move bg-background"
      >
        {children}
      </motion.div>
    </Reorder.Item>
  );
}