import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";
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
  return (
    <Card 
      className={cn(
        "relative transition-all duration-200 h-full w-full bg-card hover:bg-accent/5",
        className
      )}
      data-widget-id={id}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
        <div className="flex items-center gap-2">
          <div className="touch-none">
            <GripVertical 
              className="h-4 w-4 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors" 
            />
          </div>
          <CardTitle className="text-sm font-medium truncate">{title}</CardTitle>
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <span className="sr-only">Close</span>
          </button>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0 overflow-hidden">
        <div className="h-full w-full">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}