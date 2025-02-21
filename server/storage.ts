import { nodes, acls, roles, type Node, type InsertNode, type Acl, type InsertAcl, type Role, type InsertRole } from "@shared/schema";

export interface IStorage {
  // Node operations
  getNode(id: number): Promise<Node | undefined>;
  getNodes(): Promise<Node[]>;
  createNode(node: InsertNode): Promise<Node>;
  updateNodeStatus(id: number, status: string): Promise<Node | undefined>;

  // Role operations
  getRole(id: number): Promise<Role | undefined>;
  getRoles(): Promise<Role[]>;
  createRole(role: InsertRole): Promise<Role>;
  updateRole(id: number, role: Partial<Role>): Promise<Role | undefined>;
  deleteRole(id: number): Promise<boolean>;

  // ACL operations
  getAcl(id: number): Promise<Acl | undefined>;
  getAcls(): Promise<Acl[]>;
  createAcl(acl: InsertAcl): Promise<Acl>;
  updateAcl(id: number, acl: Partial<Acl>): Promise<Acl | undefined>;
  getAclsByRole(roleId: number): Promise<Acl[]>;
}

export class MemStorage implements IStorage {
  private nodes: Map<number, Node>;
  private acls: Map<number, Acl>;
  private roles: Map<number, Role>;
  private nodeCurrentId: number;
  private aclCurrentId: number;
  private roleCurrentId: number;

  constructor() {
    this.nodes = new Map();
    this.acls = new Map();
    this.roles = new Map();
    this.nodeCurrentId = 1;
    this.aclCurrentId = 1;
    this.roleCurrentId = 1;
  }

  // Node operations
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
      tags: insertNode.tags || [],
      config: insertNode.config || null,
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
      lastSeen: new Date(),
    };
    this.nodes.set(id, updatedNode);
    return updatedNode;
  }

  // Role operations
  async getRole(id: number): Promise<Role | undefined> {
    return this.roles.get(id);
  }

  async getRoles(): Promise<Role[]> {
    return Array.from(this.roles.values());
  }

  async createRole(insertRole: InsertRole): Promise<Role> {
    const id = this.roleCurrentId++;
    const role: Role = {
      id,
      name: insertRole.name,
      description: insertRole.description || "",
      permissions: {
        canView: true,
        canEdit: false,
        canDelete: false,
        canManageACLs: false,
        ...insertRole.permissions,
      },
    };
    this.roles.set(id, role);
    return role;
  }

  async updateRole(id: number, update: Partial<Role>): Promise<Role | undefined> {
    const role = await this.getRole(id);
    if (!role) return undefined;

    const updatedRole = { 
      ...role,
      ...update,
      permissions: {
        ...role.permissions,
        ...update.permissions,
      },
    };
    this.roles.set(id, updatedRole);
    return updatedRole;
  }

  async deleteRole(id: number): Promise<boolean> {
    return this.roles.delete(id);
  }

  // ACL operations
  async getAcl(id: number): Promise<Acl | undefined> {
    return this.acls.get(id);
  }

  async getAcls(): Promise<Acl[]> {
    return Array.from(this.acls.values());
  }

  async createAcl(insertAcl: InsertAcl): Promise<Acl> {
    const id = this.aclCurrentId++;
    const acl: Acl = {
      id,
      name: insertAcl.name,
      description: insertAcl.description || "",
      rules: insertAcl.rules,
      roleId: insertAcl.roleId,
      enabled: insertAcl.enabled ?? true,
      priority: this.aclCurrentId,
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

  async getAclsByRole(roleId: number): Promise<Acl[]> {
    return Array.from(this.acls.values()).filter(acl => acl.roleId === roleId);
  }
}

export const storage = new MemStorage();