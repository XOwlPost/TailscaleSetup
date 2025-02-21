import { Link } from "wouter";
import { useLocation } from "wouter";
import { Sidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Network, Server, Settings } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex">
      <Sidebar>
        <div className="space-y-4 py-4">
          <div className="px-4 py-2">
            <h2 className="text-lg font-semibold tracking-tight">Tailscale Manager</h2>
          </div>
          <div className="space-y-1">
            <Link href="/">
              <Button 
                variant={location === "/" ? "secondary" : "ghost"} 
                className="w-full justify-start"
              >
                <Network className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/nodes">
              <Button 
                variant={location === "/nodes" ? "secondary" : "ghost"} 
                className="w-full justify-start"
              >
                <Server className="mr-2 h-4 w-4" />
                Nodes
              </Button>
            </Link>
            <Link href="/settings">
              <Button 
                variant={location === "/settings" ? "secondary" : "ghost"} 
                className="w-full justify-start"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
          </div>
        </div>
      </Sidebar>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
