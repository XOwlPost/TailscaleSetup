import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Check, Cpu, HardDrive, Network, Terminal } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface NodeStatus {
  tailscale: string;
  system: {
    cpu: string;
    memory: string;
    packet_loss: string;
  };
  services: {
    ssh: string;
    dns: string;
    network: string;
  };
}

export function NodeMonitor() {
  const [status, setStatus] = useState<NodeStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Use secure WebSocket if the page is served over HTTPS
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'node_status_update') {
          setStatus(data.data);
          setError(null);
        }
      } catch (err) {
        setError("Failed to parse status update");
      }
    };

    ws.onerror = () => {
      setError("Failed to connect to monitoring service");
    };

    return () => ws.close();
  }, []);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            System Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>CPU Usage:</span>
              <span>{status?.system.cpu}%</span>
            </div>
            <div className="flex justify-between">
              <span>Memory Usage:</span>
              <span>{status?.system.memory}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-4 w-4" />
            Network Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Packet Loss:</span>
              <span>{status?.system.packet_loss}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Tailscale:</span>
              {status?.tailscale.includes("offline") ? (
                <span className="text-red-500">Offline</span>
              ) : (
                <span className="text-green-500">Online</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-4 w-4" />
            Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(status?.services || {}).map(([service, state]) => (
              <div key={service} className="flex items-center gap-2">
                <span className="capitalize">{service}:</span>
                {state === "active" ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}