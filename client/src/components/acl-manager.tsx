import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Role, Acl } from "@shared/schema";
import { AclDialog } from "./acl-dialog";

interface AclManagerProps {
  acls: Acl[];
  roles: Role[];
}

export function AclManager({ acls, roles }: AclManagerProps) {
  const [selectedAcl, setSelectedAcl] = useState<Acl | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDeleteAcl = async (acl: Acl) => {
    try {
      await apiRequest("DELETE", `/api/acls/${acl.id}`, undefined);
      queryClient.invalidateQueries({ queryKey: ["/api/acls"] });
      toast({
        title: "ACL deleted",
        description: `ACL "${acl.name}" has been deleted.`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to delete ACL",
        description: "An error occurred while deleting the ACL."
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => {
          setSelectedAcl(null);
          setDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add ACL
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {acls.map((acl) => (
            <TableRow key={acl.id}>
              <TableCell className="font-medium">{acl.name}</TableCell>
              <TableCell>{acl.description}</TableCell>
              <TableCell>
                {roles.find(r => r.id === acl.roleId)?.name || "No Role"}
              </TableCell>
              <TableCell>
                <Badge variant={acl.enabled ? "default" : "secondary"}>
                  {acl.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </TableCell>
              <TableCell>{acl.priority}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedAcl(acl);
                      setDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteAcl(acl)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AclDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        acl={selectedAcl}
        roles={roles}
      />
    </div>
  );
}
