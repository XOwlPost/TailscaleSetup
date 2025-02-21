import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Terminal, RefreshCcw, Network, HardDrive } from "lucide-react";

interface LogEntry {
  timestamp: string;
  type: 'service' | 'network' | 'memory' | 'info';
  message: string;
  status: 'start' | 'success' | 'error';
}

export function LogViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'log_entry') {
          setLogs(prev => [...prev, data.log].slice(-100)); // Keep last 100 logs
          scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      } catch (error) {
        console.error('Failed to parse log entry:', error);
      }
    };

    return () => ws.close();
  }, []);

  const getLogIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'service':
        return <RefreshCcw className="h-4 w-4" />;
      case 'network':
        return <Network className="h-4 w-4" />;
      case 'memory':
        return <HardDrive className="h-4 w-4" />;
      default:
        return <Terminal className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: LogEntry['status']) => {
    switch (status) {
      case 'start':
        return 'bg-blue-500/20 text-blue-500';
      case 'success':
        return 'bg-green-500/20 text-green-500';
      case 'error':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex-none p-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Terminal className="h-5 w-5" />
          System Logs
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-4 pt-0">
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-2">
            {logs.map((log, index) => (
              <div
                key={index}
                className={cn(
                  "p-2 rounded-lg flex items-start gap-2",
                  getStatusColor(log.status)
                )}
              >
                {getLogIcon(log.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs opacity-70">{log.timestamp}</span>
                    <Badge variant="outline" className="text-xs">
                      {log.type}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm whitespace-pre-wrap break-words">
                    {log.message}
                  </p>
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}