import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Power, RefreshCw } from "lucide-react";
import type { Node } from "@shared/schema";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface NodeCardProps {
  node: Node;
  onRestart?: () => void;
}

const statusVariants = cva("", {
  variants: {
    status: {
      online: "bg-green-500/20 text-green-700",
      offline: "bg-red-500/20 text-red-700",
      pending: "bg-yellow-500/20 text-yellow-700"
    }
  },
  defaultVariants: {
    status: "pending"
  }
});

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
        <Badge className={statusVariants({ status: node.status as "online" | "offline" | "pending" })}>
          {node.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="flex items-center">
            <span className="text-sm font-medium">Last seen:</span>
            <span className="ml-2 text-sm text-muted-foreground">
              {node.lastSeen ? new Date(node.lastSeen).toLocaleString() : 'Never'}
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