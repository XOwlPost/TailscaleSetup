import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Check, Cpu, Network, Terminal } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/use-window-size";

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
  const [healthScore, setHealthScore] = useState(100);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'node_status_update') {
          setStatus(data.data);
          setError(null);
          const newScore = calculateHealthScore(data.data);
          setHealthScore(newScore);
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

  // Effect to handle confetti display
  useEffect(() => {
    if (healthScore >= 95) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    } else {
      setShowConfetti(false);
    }
  }, [healthScore]);

  const calculateHealthScore = (status: NodeStatus): number => {
    let score = 100;

    // CPU penalty (max -30)
    const cpuUsage = parseFloat(status.system.cpu);
    if (cpuUsage > 90) score -= 30;
    else if (cpuUsage > 70) score -= 15;

    // Memory penalty (max -30)
    const memoryUsage = parseFloat(status.system.memory);
    if (memoryUsage > 90) score -= 30;
    else if (memoryUsage > 70) score -= 15;

    // Packet loss penalty (max -20)
    const packetLoss = parseFloat(status.system.packet_loss);
    if (packetLoss > 10) score -= 20;
    else if (packetLoss > 5) score -= 10;

    // Service status penalty (-5 per inactive service)
    Object.values(status.services).forEach(serviceStatus => {
      if (serviceStatus !== "active") score -= 5;
    });

    // Tailscale status penalty (-10 if offline)
    if (status.tailscale.includes("offline")) score -= 10;

    return Math.max(0, score);
  };

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return "text-red-500";
    if (value >= thresholds.warning) return "text-yellow-500";
    return "text-green-500";
  };

  const getStatusAnimation = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return "animate-pulse";
    if (value >= thresholds.warning) return "animate-bounce";
    return "animate-pulse";
  };

  const getHealthScoreColor = (score: number) => {
    if (score < 50) return "bg-red-500";
    if (score < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const cpuUsage = parseFloat(status?.system.cpu || "0");
  const memoryUsage = parseFloat(status?.system.memory || "0");
  const packetLoss = parseFloat(status?.system.packet_loss || "0");

  return (
    <>
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
          initialVelocityY={20}
          colors={['#22c55e', '#3b82f6', '#f59e0b', '#ec4899']}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 50,
            pointerEvents: 'none'
          }}
        />
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Health Score Card */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className={cn(
                "h-4 w-4",
                getHealthScoreColor(healthScore)
              )} />
              System Health Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Overall Health:</span>
                <span className={cn(
                  "font-bold",
                  getHealthScoreColor(healthScore)
                )}>{healthScore}%</span>
              </div>
              <Progress value={healthScore} className={cn(
                "transition-all duration-500",
                getHealthScoreColor(healthScore)
              )} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className={cn(
                "h-4 w-4",
                getStatusColor(cpuUsage, { warning: 70, critical: 90 }),
                getStatusAnimation(cpuUsage, { warning: 70, critical: 90 })
              )} />
              System Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span>CPU Usage:</span>
                  <span className={cn(
                    "font-bold",
                    getStatusColor(cpuUsage, { warning: 70, critical: 90 })
                  )}>{cpuUsage}%</span>
                </div>
                <Progress
                  value={cpuUsage}
                  className={cn(
                    "transition-all duration-500",
                    getStatusColor(cpuUsage, { warning: 70, critical: 90 })
                  )}
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span>Memory Usage:</span>
                  <span className={cn(
                    "font-bold",
                    getStatusColor(memoryUsage, { warning: 80, critical: 95 })
                  )}>{memoryUsage}%</span>
                </div>
                <Progress
                  value={memoryUsage}
                  className={cn(
                    "transition-all duration-500",
                    getStatusColor(memoryUsage, { warning: 80, critical: 95 })
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className={cn(
                "h-4 w-4",
                getStatusColor(packetLoss, { warning: 5, critical: 10 }),
                getStatusAnimation(packetLoss, { warning: 5, critical: 10 })
              )} />
              Network Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span>Packet Loss:</span>
                  <span className={cn(
                    "font-bold",
                    getStatusColor(packetLoss, { warning: 5, critical: 10 })
                  )}>{packetLoss}%</span>
                </div>
                <Progress
                  value={packetLoss}
                  className={cn(
                    "transition-all duration-500",
                    getStatusColor(packetLoss, { warning: 5, critical: 10 })
                  )}
                />
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span>Tailscale:</span>
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  status?.tailscale.includes("offline")
                    ? "bg-red-500 animate-pulse"
                    : "bg-green-500 animate-pulse"
                )} />
                <span className={status?.tailscale.includes("offline") ? "text-red-500" : "text-green-500"}>
                  {status?.tailscale.includes("offline") ? "Offline" : "Online"}
                </span>
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
                <div key={service} className="flex items-center justify-between">
                  <span className="capitalize">{service}:</span>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      state === "active"
                        ? "bg-green-500 animate-pulse"
                        : "bg-red-500 animate-pulse"
                    )} />
                    <span className={state === "active" ? "text-green-500" : "text-red-500"}>
                      {state === "active" ? "Running" : "Stopped"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}