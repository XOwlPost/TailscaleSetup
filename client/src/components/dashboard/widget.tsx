import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Grip, X } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";

export interface WidgetProps {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
  onRemove?: () => void;
  isConfigurable?: boolean;
}

export function DashboardWidget({ 
  id,
  title, 
  children, 
  className,
  onRemove,
  isConfigurable = false
}: WidgetProps) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <Card 
      className={cn(
        "relative transition-shadow",
        isDragging && "shadow-lg",
        className
      )}
      data-widget-id={id}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Grip className="h-4 w-4 cursor-move text-muted-foreground" 
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
          />
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
