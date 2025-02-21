import { nodes, acls, roles, widgets, type Node, type InsertNode, type Acl, type InsertAcl, type Role, type InsertRole, type Widget, type InsertWidget } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

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

  // Widget operations
  getWidget(widgetId: string): Promise<Widget | undefined>;
  getWidgets(): Promise<Widget[]>;
  createWidget(widget: InsertWidget): Promise<Widget>;
  updateWidget(widgetId: string, widget: Partial<Widget>): Promise<Widget | undefined>;
  deleteWidget(widgetId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // Node operations
  async getNode(id: number): Promise<Node | undefined> {
    const [node] = await db.select().from(nodes).where(eq(nodes.id, id));
    return node;
  }

  async getNodes(): Promise<Node[]> {
    return db.select().from(nodes);
  }

  async createNode(insertNode: InsertNode): Promise<Node> {
    const [node] = await db.insert(nodes).values(insertNode).returning();
    return node;
  }

  async updateNodeStatus(id: number, status: string): Promise<Node | undefined> {
    const [node] = await db
      .update(nodes)
      .set({ status, lastSeen: new Date() })
      .where(eq(nodes.id, id))
      .returning();
    return node;
  }

  // Role operations
  async getRole(id: number): Promise<Role | undefined> {
    const [role] = await db.select().from(roles).where(eq(roles.id, id));
    return role;
  }

  async getRoles(): Promise<Role[]> {
    return db.select().from(roles);
  }

  async createRole(role: InsertRole): Promise<Role> {
    const [created] = await db.insert(roles).values(role).returning();
    return created;
  }

  async updateRole(id: number, update: Partial<Role>): Promise<Role | undefined> {
    const [updated] = await db
      .update(roles)
      .set(update)
      .where(eq(roles.id, id))
      .returning();
    return updated;
  }

  async deleteRole(id: number): Promise<boolean> {
    const result = await db.delete(roles).where(eq(roles.id, id));
    return result.rowCount > 0;
  }

  // ACL operations
  async getAcl(id: number): Promise<Acl | undefined> {
    const [acl] = await db.select().from(acls).where(eq(acls.id, id));
    return acl;
  }

  async getAcls(): Promise<Acl[]> {
    return db.select().from(acls);
  }

  async createAcl(acl: InsertAcl): Promise<Acl> {
    const [created] = await db.insert(acls).values(acl).returning();
    return created;
  }

  async updateAcl(id: number, update: Partial<Acl>): Promise<Acl | undefined> {
    const [updated] = await db
      .update(acls)
      .set(update)
      .where(eq(acls.id, id))
      .returning();
    return updated;
  }

  async getAclsByRole(roleId: number): Promise<Acl[]> {
    return db.select().from(acls).where(eq(acls.roleId, roleId));
  }

  // Widget operations
  async getWidget(widgetId: string): Promise<Widget | undefined> {
    const [widget] = await db.select().from(widgets).where(eq(widgets.widgetId, widgetId));
    return widget;
  }

  async getWidgets(): Promise<Widget[]> {
    return db.select().from(widgets);
  }

  async createWidget(widget: InsertWidget): Promise<Widget> {
    const [created] = await db.insert(widgets).values(widget).returning();
    return created;
  }

  async updateWidget(widgetId: string, update: Partial<Widget>): Promise<Widget | undefined> {
    const [updated] = await db
      .update(widgets)
      .set({ ...update, lastInteraction: new Date() })
      .where(eq(widgets.widgetId, widgetId))
      .returning();
    return updated;
  }

  async deleteWidget(widgetId: string): Promise<boolean> {
    const result = await db.delete(widgets).where(eq(widgets.widgetId, widgetId));
    return result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();