import { pgTable, text, serial, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const nodes = pgTable("nodes", {
  id: serial("id").primaryKey(),
  hostname: text("hostname").notNull(),
  ipAddress: text("ip_address").notNull(),
  status: text("status").notNull().default("pending"),
  tags: text("tags").array(),
  lastSeen: timestamp("last_seen"),
  config: jsonb("config"),
});

// Define roles table
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  permissions: jsonb("permissions").notNull(),
});

// Enhanced ACLs table with role-based access
export const acls = pgTable("acls", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  rules: jsonb("rules").notNull(),
  roleId: serial("role_id").references(() => roles.id),
  enabled: boolean("enabled").default(true),
  priority: serial("priority"),
});

// Node schemas
export const insertNodeSchema = createInsertSchema(nodes).pick({
  hostname: true,
  ipAddress: true,
  tags: true,
  config: true,
});

// Role schemas
export const insertRoleSchema = createInsertSchema(roles);
export const roleSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  permissions: z.object({
    canView: z.boolean(),
    canEdit: z.boolean(),
    canDelete: z.boolean(),
    canManageACLs: z.boolean(),
  }),
});

// ACL schemas
export const insertAclSchema = createInsertSchema(acls).extend({
  rules: z.object({
    sources: z.array(z.string()),
    destinations: z.array(z.string()),
    ports: z.array(z.number()),
    action: z.enum(["allow", "deny"]),
  }),
});

// Types
export type InsertNode = z.infer<typeof insertNodeSchema>;
export type Node = typeof nodes.$inferSelect;
export type InsertRole = z.infer<typeof insertRoleSchema>;
export type Role = z.infer<typeof roleSchema>;
export type InsertAcl = z.infer<typeof insertAclSchema>;
export type Acl = typeof acls.$inferSelect;