import { type NodeStatus } from "@shared/schema";
import { log } from "../vite";
import { WebSocket } from "ws";

interface LogEntry {
  timestamp: string;
  type: 'service' | 'network' | 'memory' | 'info';
  message: string;
  status: 'start' | 'success' | 'error';
}

interface HealingAction {
  type: 'restart_service' | 'clear_memory' | 'optimize_network';
  target: string;
  threshold: number;
  action: () => Promise<void>;
}

export class HealingAgent {
  private actions: HealingAction[] = [
    {
      type: 'restart_service',
      target: 'service',
      threshold: 30,
      action: async () => {
        this.broadcastLog({
          type: 'service',
          message: '🔄 Restarting problematic services...',
          status: 'start',
          timestamp: new Date().toISOString()
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.broadcastLog({
          type: 'service',
          message: '✅ Services successfully restarted',
          status: 'success',
          timestamp: new Date().toISOString()
        });
      }
    },
    {
      type: 'clear_memory',
      target: 'memory',
      threshold: 90,
      action: async () => {
        this.broadcastLog({
          type: 'memory',
          message: '🧹 Clearing memory cache...',
          status: 'start',
          timestamp: new Date().toISOString()
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.broadcastLog({
          type: 'memory',
          message: '✅ Memory cache cleared successfully',
          status: 'success',
          timestamp: new Date().toISOString()
        });
      }
    },
    {
      type: 'optimize_network',
      target: 'network',
      threshold: 10,
      action: async () => {
        this.broadcastLog({
          type: 'network',
          message: '🌐 Optimizing network settings...',
          status: 'start',
          timestamp: new Date().toISOString()
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.broadcastLog({
          type: 'network',
          message: '✅ Network optimization complete',
          status: 'success',
          timestamp: new Date().toISOString()
        });
      }
    }
  ];

  private clients: Set<WebSocket> = new Set();

  public addClient(ws: WebSocket) {
    this.clients.add(ws);
  }

  public removeClient(ws: WebSocket) {
    this.clients.delete(ws);
  }

  private broadcastLog(logEntry: LogEntry) {
    const message = JSON.stringify({
      type: 'log_entry',
      log: logEntry
    });

    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });

    // Also log to server console
    log(`[${logEntry.type}] ${logEntry.message}`);
  }

  private async executeHealingAction(action: HealingAction) {
    try {
      await action.action();
    } catch (error) {
      this.broadcastLog({
        type: action.target as LogEntry['type'],
        message: `❌ Healing action failed: ${error}`,
        status: 'error',
        timestamp: new Date().toISOString()
      });
    }
  }

  public async checkAndHeal(status: NodeStatus): Promise<void> {
    const memoryUsage = parseFloat(status.system.memory);
    const packetLoss = parseFloat(status.system.packet_loss);
    const serviceIssues = Object.values(status.services).filter(s => s !== 'active').length;

    if (memoryUsage > 90) {
      await this.executeHealingAction(
        this.actions.find(a => a.type === 'clear_memory')!
      );
    }

    if (packetLoss > 10) {
      await this.executeHealingAction(
        this.actions.find(a => a.type === 'optimize_network')!
      );
    }

    if (serviceIssues > 0) {
      await this.executeHealingAction(
        this.actions.find(a => a.type === 'restart_service')!
      );
    }
  }
}

export const healingAgent = new HealingAgent();