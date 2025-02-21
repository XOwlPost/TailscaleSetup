import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Server, Network, Shield, Plus } from "lucide-react";
import { NodeMonitor } from "@/components/node-monitor";
import { TourGuide } from "@/components/tour-guide";
import { Button } from "@/components/ui/button";
import { DashboardWidget } from "@/components/dashboard/widget";
import { GridLayout, GridItem } from "@/components/dashboard/grid-layout";
import { useWidgetStore, type Widget } from "@/components/dashboard/widget-store";
import type { Node, Acl } from "@shared/schema";
import { type ReactNode } from "react";

export default function Dashboard() {
  const { widgets, addWidget, removeWidget } = useWidgetStore();
  const nodesQuery = useQuery<Node[]>({ 
    queryKey: ["/api/nodes"]
  });

  const aclsQuery = useQuery<Acl[]>({
    queryKey: ["/api/acls"]
  });

  if (nodesQuery.isError || aclsQuery.isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load dashboard data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  const handleAddWidget = () => {
    addWidget({
      type: "node-monitor",
      title: "Node Monitor",
      position: widgets.length,
    });
  };

  const widgetElements = widgets.map((widget) => (
    <DashboardWidget
      key={widget.id}
      id={widget.id}
      title={widget.title}
      onRemove={() => removeWidget(widget.id)}
    >
      {widget.type === "node-monitor" && <NodeMonitor />}
    </DashboardWidget>
  ));

  const handleReorder = (reorderedWidgets: ReactNode[]) => {
    // Update widget positions based on new order
    reorderedWidgets.forEach((widget, index) => {
      const widgetElement = widget as React.ReactElement;
      const widgetId = widgetElement.props.id;
      const existingWidget = widgets.find(w => w.id === widgetId);
      if (existingWidget) {
        existingWidget.position = index;
      }
    });
  };

  return (
    <div className="space-y-6">
      <TourGuide />

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button onClick={handleAddWidget}>
          <Plus className="mr-2 h-4 w-4" />
          Add Widget
        </Button>
      </div>

      <GridLayout onReorder={handleReorder}>
        {widgetElements.map((widget) => (
          <GridItem key={(widget as React.ReactElement).key}>
            {widget}
          </GridItem>
        ))}
      </GridLayout>
    </div>
  );
}