import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNodeSchema, insertAclSchema } from "@shared/schema";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function registerRoutes(app: Express): Promise<Server> {
  // Node management endpoints
  app.get("/api/nodes", async (_req, res) => {
    const nodes = await storage.getNodes();
    res.json(nodes);
  });

  app.post("/api/nodes", async (req, res) => {
    const result = insertNodeSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    const node = await storage.createNode(result.data);
    res.json(node);
  });

  app.put("/api/nodes/:id/status", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const node = await storage.updateNodeStatus(Number(id), status);
    if (!node) {
      return res.status(404).json({ error: "Node not found" });
    }

    res.json(node);
  });

  // Add new endpoint for node restart
  app.post("/api/nodes/:id/restart", async (req, res) => {
    const { id } = req.params;
    const node = await storage.getNode(Number(id));

    if (!node) {
      return res.status(404).json({ error: "Node not found" });
    }

    try {
      await execAsync(`tailscale up --reset --hostname=${node.hostname}`);
      const updatedNode = await storage.updateNodeStatus(Number(id), "pending");
      res.json(updatedNode);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  // ACL management endpoints
  app.get("/api/acls", async (_req, res) => {
    const acls = await storage.getAcls();
    res.json(acls);
  });

  app.post("/api/acls", async (req, res) => {
    const result = insertAclSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    const acl = await storage.createAcl(result.data);
    res.json(acl);
  });

  app.put("/api/acls/:id", async (req, res) => {
    const { id } = req.params;
    const acl = await storage.updateAcl(Number(id), req.body);
    if (!acl) {
      return res.status(404).json({ error: "ACL not found" });
    }
    res.json(acl);
  });

  // Tailscale management endpoints
  app.post("/api/tailscale/join", async (req, res) => {
    const { authKey } = req.body;
    if (!authKey) {
      return res.status(400).json({ error: "Auth key is required" });
    }

    try {
      await execAsync(`tailscale up --authkey=${authKey}`);
      res.json({ status: "success" });
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}