import { useQuery } from "@tanstack/react-query";
import { NodeCard } from "@/components/node-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Node } from "@shared/schema";

export default function Nodes() {
  const { toast } = useToast();

  const nodesQuery = useQuery<Node[]>({
    queryKey: ["/api/nodes"]
  });

  const handleRestart = async (nodeId: number) => {
    try {
      await fetch(`/api/nodes/${nodeId}/restart`, { method: 'POST' });
      toast({
        title: "Node restart initiated",
        description: "The node will restart shortly."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to restart node",
        description: "Please try again later."
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Nodes</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Node
        </Button>
      </div>

      {nodesQuery.isLoading ? (
        <div>Loading nodes...</div>
      ) : nodesQuery.isError ? (
        <div>Error loading nodes</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(nodesQuery.data || []).map((node) => (
            <NodeCard
              key={node.id}
              node={node}
              onRestart={() => handleRestart(node.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}