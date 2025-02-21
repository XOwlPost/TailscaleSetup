import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Grip, X } from "lucide-react";
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
        "relative transition-shadow h-full w-full",
        className
      )}
      data-widget-id={id}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
        <div className="flex items-center gap-2">
          <Grip 
            className="h-4 w-4 cursor-grab text-muted-foreground hidden sm:block" 
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
      <CardContent className="p-4 pt-0 overflow-hidden">
        <div className="h-full w-full">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}