import { useQuery } from "@tanstack/react-query";
import { NodeCard } from "@/components/node-card";
import { AddNodeDialog } from "@/components/add-node-dialog";
import { useToast } from "@/hooks/use-toast";
import type { Node } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function Nodes() {
  const { toast } = useToast();

  const nodesQuery = useQuery<Node[]>({
    queryKey: ["/api/nodes"]
  });

  const handleRestart = async (nodeId: number) => {
    try {
      await apiRequest("POST", `/api/nodes/${nodeId}/restart`, undefined);
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
        <AddNodeDialog />
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