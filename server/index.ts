import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { WebSocket, WebSocketServer } from "ws";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simulate node metrics for testing animations
function generateTestMetrics() {
  return {
    tailscale: Math.random() > 0.1 ? "online" : "offline",
    system: {
      cpu: (60 + Math.random() * 35).toFixed(1), // Varies between 60-95%
      memory: (70 + Math.random() * 25).toFixed(1), // Varies between 70-95%
      packet_loss: (Math.random() * 12).toFixed(1), // Varies between 0-12%
    },
    services: {
      ssh: Math.random() > 0.1 ? "active" : "inactive",
      dns: Math.random() > 0.1 ? "active" : "inactive",
      network: Math.random() > 0.1 ? "active" : "inactive",
    }
  };
}

// Create WebSocket server for real-time updates
const wss = new WebSocketServer({ noServer: true });

// Track connected clients
const clients = new Set<WebSocket>();

wss.on('connection', (ws) => {
  clients.add(ws);

  // Send initial test data
  ws.send(JSON.stringify({
    type: 'node_status_update',
    data: generateTestMetrics()
  }));

  // Simulate periodic updates every 3 seconds
  const intervalId = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'node_status_update',
        data: generateTestMetrics()
      }));
    }
  }, 3000);

  ws.on('close', () => {
    clients.delete(ws);
    clearInterval(intervalId);
  });

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      if (data.type === 'node_status') {
        // Broadcast node status to all connected clients
        const broadcastData = JSON.stringify({
          type: 'node_status_update',
          data: data.status
        });

        clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(broadcastData);
          }
        });
      }
    } catch (error) {
      log(`WebSocket message error: ${error}`);
    }
  });
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Setup WebSocket handling on the HTTP server
  server.on('upgrade', (request, socket, head) => {
    if (request.url === '/ws') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();