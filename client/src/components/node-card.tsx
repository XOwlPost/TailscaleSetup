import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Power, RefreshCw } from "lucide-react";
import type { Node } from "@shared/schema";

interface NodeCardProps {
  node: Node;
  onRestart?: () => void;
}

export function NodeCard({ node, onRestart }: NodeCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col space-y-1.5">
          <h3 className="font-semibold leading-none tracking-tight">
            {node.hostname}
          </h3>
          <p className="text-sm text-muted-foreground">
            {node.ipAddress}
          </p>
        </div>
        <StatusBadge status={node.status} />
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="flex items-center">
            <span className="text-sm font-medium">Last seen:</span>
            <span className="ml-2 text-sm text-muted-foreground">
              {new Date(node.lastSeen!).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium">Tags:</span>
            <div className="ml-2 flex gap-1">
              {node.tags?.map((tag) => (
                <span key={tag} className="rounded bg-primary/10 px-2 py-1 text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={onRestart}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Restart
        </Button>
        <Button variant="destructive" size="sm">
          <Power className="mr-2 h-4 w-4" />
          Shutdown
        </Button>
      </CardFooter>
    </Card>
  );
}
