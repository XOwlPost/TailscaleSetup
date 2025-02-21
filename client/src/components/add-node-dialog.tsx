import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { insertNodeSchema, type InsertNode } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export function AddNodeDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<InsertNode>({
    hostname: "",
    ipAddress: "",
    tags: [],
    config: null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validatedData = insertNodeSchema.parse(formData);
      await apiRequest("POST", "/api/nodes", validatedData);

      toast({
        title: "Node added successfully",
        description: "The new node has been added to your network."
      });

      queryClient.invalidateQueries({ queryKey: ["/api/nodes"] });
      setOpen(false);
      setFormData({ hostname: "", ipAddress: "", tags: [], config: null });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to add node",
        description: "Please check your input and try again."
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Node
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Node</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hostname">Hostname</Label>
            <Input
              id="hostname"
              value={formData.hostname}
              onChange={(e) => setFormData(prev => ({ ...prev, hostname: e.target.value }))}
              placeholder="e.g., tailscale-node-1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ipAddress">IP Address</Label>
            <Input
              id="ipAddress"
              value={formData.ipAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, ipAddress: e.target.value }))}
              placeholder="e.g., 100.100.100.100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags?.join(",")}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                tags: e.target.value.split(",").map(tag => tag.trim()).filter(Boolean)
              }))}
              placeholder="e.g., prod,web,internal"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Node</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}