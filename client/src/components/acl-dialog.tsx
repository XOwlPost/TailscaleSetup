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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { insertAclSchema, type Acl, type Role } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface AclDialogProps {
  acl?: Acl | null;
  roles: Role[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type FormValues = {
  name: string;
  description: string;
  rules: {
    sources: string[];
    destinations: string[];
    ports: number[];
    action: "allow" | "deny";
  };
  roleId: number;
  enabled: boolean;
};

export function AclDialog({ acl, roles, open, onOpenChange }: AclDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(insertAclSchema),
    defaultValues: acl ? {
      ...acl,
      roleId: acl.roleId || 0,
      description: acl.description || "",
    } : {
      name: "",
      description: "",
      rules: {
        sources: [],
        destinations: [],
        ports: [],
        action: "allow",
      },
      roleId: 0,
      enabled: true,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      if (acl) {
        await apiRequest("PUT", `/api/acls/${acl.id}`, data);
      } else {
        await apiRequest("POST", "/api/acls", data);
      }

      queryClient.invalidateQueries({ queryKey: ["/api/acls"] });
      toast({
        title: acl ? "ACL updated" : "ACL created",
        description: acl
          ? `ACL "${data.name}" has been updated.`
          : `ACL "${data.name}" has been created.`,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: acl ? "Failed to update ACL" : "Failed to create ACL",
        description: "An error occurred. Please try again.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{acl ? "Edit ACL" : "Create ACL"}</DialogTitle>
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
                    A unique name for this ACL rule
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
                    A brief description of what this ACL rule does
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id.toString()}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The role this ACL rule applies to
                  </FormDescription>
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="rules.sources"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source IPs</FormLabel>
                    <FormControl>
                      <Input 
                        value={field.value.join(",")}
                        onChange={(e) => field.onChange(
                          e.target.value.split(",").map((s) => s.trim())
                        )}
                        placeholder="e.g., 100.100.100.100,100.100.100.101"
                      />
                    </FormControl>
                    <FormDescription>
                      Comma-separated list of source IPs
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rules.destinations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination IPs</FormLabel>
                    <FormControl>
                      <Input 
                        value={field.value.join(",")}
                        onChange={(e) => field.onChange(
                          e.target.value.split(",").map((s) => s.trim())
                        )}
                        placeholder="e.g., 100.100.100.102,100.100.100.103"
                      />
                    </FormControl>
                    <FormDescription>
                      Comma-separated list of destination IPs
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="rules.ports"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ports</FormLabel>
                  <FormControl>
                    <Input 
                      value={field.value.join(",")}
                      onChange={(e) => field.onChange(
                        e.target.value.split(",").map((p) => parseInt(p.trim()))
                      )}
                      placeholder="e.g., 80,443,8080"
                    />
                  </FormControl>
                  <FormDescription>
                    Comma-separated list of ports
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rules.action"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Action</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an action" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="allow">Allow</SelectItem>
                      <SelectItem value="deny">Deny</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Whether to allow or deny the traffic
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Enabled</FormLabel>
                    <FormDescription>
                      Whether this ACL rule is active
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {acl ? "Update ACL" : "Create ACL"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}