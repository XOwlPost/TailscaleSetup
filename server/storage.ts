import { nodes, acls, type Node, type InsertNode, type Acl, type InsertAcl } from "@shared/schema";

export interface IStorage {
  // Node operations
  getNode(id: number): Promise<Node | undefined>;
  getNodes(): Promise<Node[]>;
  createNode(node: InsertNode): Promise<Node>;
  updateNodeStatus(id: number, status: string): Promise<Node | undefined>;

  // ACL operations
  getAcl(id: number): Promise<Acl | undefined>;
  getAcls(): Promise<Acl[]>;
  createAcl(acl: InsertAcl): Promise<Acl>;
  updateAcl(id: number, acl: Partial<Acl>): Promise<Acl | undefined>;
}

export class MemStorage implements IStorage {
  private nodes: Map<number, Node>;
  private acls: Map<number, Acl>;
  private nodeCurrentId: number;
  private aclCurrentId: number;

  constructor() {
    this.nodes = new Map();
    this.acls = new Map();
    this.nodeCurrentId = 1;
    this.aclCurrentId = 1;
  }

  async getNode(id: number): Promise<Node | undefined> {
    return this.nodes.get(id);
  }

  async getNodes(): Promise<Node[]> {
    return Array.from(this.nodes.values());
  }

  async createNode(insertNode: InsertNode): Promise<Node> {
    const id = this.nodeCurrentId++;
    const node: Node = { 
      ...insertNode, 
      id, 
      status: "pending",
      lastSeen: new Date(),
      tags: insertNode.tags || [], // Ensure tags is never undefined
    };
    this.nodes.set(id, node);
    return node;
  }

  async updateNodeStatus(id: number, status: string): Promise<Node | undefined> {
    const node = await this.getNode(id);
    if (!node) return undefined;

    const updatedNode = { 
      ...node, 
      status,
      lastSeen: new Date()
    };
    this.nodes.set(id, updatedNode);
    return updatedNode;
  }

  async getAcl(id: number): Promise<Acl | undefined> {
    return this.acls.get(id);
  }

  async getAcls(): Promise<Acl[]> {
    return Array.from(this.acls.values());
  }

  async createAcl(insertAcl: InsertAcl): Promise<Acl> {
    const id = this.aclCurrentId++;
    const acl: Acl = { 
      ...insertAcl, 
      id,
      enabled: insertAcl.enabled ?? true, // Set default value for enabled
    };
    this.acls.set(id, acl);
    return acl;
  }

  async updateAcl(id: number, update: Partial<Acl>): Promise<Acl | undefined> {
    const acl = await this.getAcl(id);
    if (!acl) return undefined;

    const updatedAcl = { ...acl, ...update };
    this.acls.set(id, updatedAcl);
    return updatedAcl;
  }
}

export const storage = new MemStorage();