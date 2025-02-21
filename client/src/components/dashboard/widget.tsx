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
        "relative transition-shadow w-full min-h-[200px] break-inside-avoid",
        "sm:min-h-[250px]",
        isDragging && "shadow-lg",
        className
      )}
      data-widget-id={id}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Grip className="h-4 w-4 cursor-move text-muted-foreground hidden sm:block" 
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
          />
          <CardTitle className="text-sm font-medium truncate">{title}</CardTitle>
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
      <CardContent className="overflow-x-auto">
        {children}
      </CardContent>
    </Card>
  );
}