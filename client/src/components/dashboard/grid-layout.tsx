import { useEffect, useState } from "react";
import { motion, Reorder } from "framer-motion";

interface GridLayoutProps {
  children: React.ReactNode[];
  columns?: number;
  className?: string;
  onReorder?: (values: React.ReactNode[]) => void;
}

export function GridLayout({ 
  children,
  columns = 3,
  className = "",
  onReorder
}: GridLayoutProps) {
  return (
    <Reorder.Group 
      axis="y" 
      values={children}
      onReorder={onReorder}
      className={`grid gap-4 ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {children}
    </Reorder.Group>
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
      className={className}
      dragListener={false}
      layout
    >
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </Reorder.Item>
  );
}