import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoleManager } from "@/components/role-manager";
import { AclManager } from "@/components/acl-manager";
import type { Role, Acl } from "@shared/schema";

export default function Settings() {
  const rolesQuery = useQuery<Role[]>({
    queryKey: ["/api/roles"],
  });

  const aclsQuery = useQuery<Acl[]>({
    queryKey: ["/api/acls"],
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      
      <Tabs defaultValue="roles">
        <TabsList>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="acls">Access Control Lists</TabsTrigger>
        </TabsList>
        
        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Role Management</CardTitle>
            </CardHeader>
            <CardContent>
              <RoleManager roles={rolesQuery.data || []} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="acls" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ACL Management</CardTitle>
            </CardHeader>
            <CardContent>
              <AclManager 
                acls={aclsQuery.data || []} 
                roles={rolesQuery.data || []} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
