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

export const acls = pgTable("acls", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  rules: jsonb("rules").notNull(),
  enabled: boolean("enabled").default(true),
});

export const insertNodeSchema = createInsertSchema(nodes).pick({
  hostname: true,
  ipAddress: true,
  tags: true,
  config: true,
});

export const insertAclSchema = createInsertSchema(acls).pick({
  name: true,
  rules: true,
  enabled: true,
});

export type InsertNode = z.infer<typeof insertNodeSchema>;
export type Node = typeof nodes.$inferSelect;
export type InsertAcl = z.infer<typeof insertAclSchema>;
export type Acl = typeof acls.$inferSelect;
