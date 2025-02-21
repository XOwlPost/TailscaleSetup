import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Nodes from "@/pages/nodes";
import Settings from "@/pages/settings";
import DashboardLayout from "@/components/dashboard-layout";
import { SidebarProvider } from "@/components/ui/sidebar";

function Router() {
  return (
    <SidebarProvider>
      <DashboardLayout>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/nodes" component={Nodes} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </DashboardLayout>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;