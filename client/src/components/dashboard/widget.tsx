import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { GripVertical, X } from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export interface WidgetProps {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
  onRemove?: () => void;
  isConfigurable?: boolean;
  theme?: {
    primary: string;
    background?: string;
    text?: string;
    border?: string;
  };
}

export function DashboardWidget({ 
  id,
  title, 
  children, 
  className,
  onRemove,
  isConfigurable = false,
  theme
}: WidgetProps) {
  const customStyle = theme ? {
    '--widget-primary': theme.primary,
    '--widget-bg': theme.background || 'hsl(var(--card))',
    '--widget-text': theme.text || 'hsl(var(--foreground))',
    '--widget-border': theme.border || 'hsl(var(--border))',
  } as React.CSSProperties : {};

  return (
    <Card 
      className={cn(
        "relative transition-all duration-200 h-full w-full",
        theme && "custom-themed-widget",
        "hover:bg-accent/5 focus-within:ring-2 focus-within:ring-[var(--widget-primary)]",
        "data-[dragging=true]:opacity-50",
        className
      )}
      style={customStyle}
      data-widget-id={id}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
        <div className="flex items-center gap-2">
          <motion.div 
            className="touch-none group"
            whileHover={{ scale: 1.2, rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <GripVertical 
              className={cn(
                "h-4 w-4 cursor-grab active:cursor-grabbing",
                "text-muted-foreground group-hover:text-foreground transition-colors",
                "group-hover:animate-pulse"
              )}
            />
          </motion.div>
          <CardTitle className="text-sm font-medium truncate">{title}</CardTitle>
        </div>
        {onRemove && (
          <motion.button
            onClick={onRemove}
            className={cn(
              "rounded-sm opacity-70 ring-offset-background",
              "transition-opacity hover:opacity-100",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            )}
            whileHover={{ 
              scale: 1.2,
              rotate: 90
            }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </motion.button>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0 overflow-hidden">
        <motion.div 
          className="h-full w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
        >
          {children}
        </motion.div>
      </CardContent>
    </Card>
  );
}