import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { roleSchema, type Role } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface RoleDialogProps {
  role?: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RoleDialog({ role, open, onOpenChange }: RoleDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<Role>({
    resolver: zodResolver(roleSchema),
    defaultValues: role || {
      name: "",
      description: "",
      permissions: {
        canView: true,
        canEdit: false,
        canDelete: false,
        canManageACLs: false,
      },
    },
  });

  const onSubmit = async (data: Role) => {
    try {
      if (role) {
        await apiRequest("PUT", `/api/roles/${role.id}`, data);
      } else {
        await apiRequest("POST", "/api/roles", data);
      }

      queryClient.invalidateQueries({ queryKey: ["/api/roles"] });
      toast({
        title: role ? "Role updated" : "Role created",
        description: role
          ? `Role "${data.name}" has been updated.`
          : `Role "${data.name}" has been created.`,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: role ? "Failed to update role" : "Failed to create role",
        description: "An error occurred. Please try again.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{role ? "Edit Role" : "Create Role"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    A unique name for this role
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    A brief description of this role's purpose
                  </FormDescription>
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Permissions</FormLabel>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="permissions.canView"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">View nodes and ACLs</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="permissions.canEdit"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Edit nodes and ACLs</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="permissions.canDelete"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Delete nodes and ACLs</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="permissions.canManageACLs"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Manage ACL rules and permissions</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {role ? "Update Role" : "Create Role"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
