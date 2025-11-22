// schema.ts
import {
  integer,
  json,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm"; // Import relations
import { user } from "./auth-schema";

export const nodeTypeEnum = pgEnum("NodeType", ["INITIAL"]);

export const workflow = pgTable("workflow", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .$onUpdate(() => new Date())
    .notNull(),
});

export const workflowRelations = relations(workflow, ({ many }) => ({
  nodes: many(node),
  connections: many(connection),
}));

export const node = pgTable("node", {
  id: serial("id").primaryKey(),
  workflowId: integer("workflow_id")
    .notNull()
    .references(() => workflow.id, { onDelete: "cascade" }),
  type: nodeTypeEnum("type").notNull(),
  position: json("position")
    .$type<{ x: number; y: number }>()
    .default({ x: 0, y: 0 })
    .notNull(),
  data: json("data").$type<Record<string, unknown>>().default({}).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .$onUpdate(() => new Date())
    .notNull(),
});

export const nodeRelations = relations(node, ({ one }) => ({
  workflow: one(workflow, {
    fields: [node.workflowId],
    references: [workflow.id],
  }),
}));

export const connection = pgTable(
  "connection",
  {
    id: serial("id").primaryKey(),
    workflowId: integer("workflow_id")
      .notNull()
      .references(() => workflow.id, { onDelete: "cascade" }),
    fromNodeId: integer("from_node_id")
      .notNull()
      .references(() => node.id, { onDelete: "cascade" }),
    toNodeId: integer("to_node_id")
      .notNull()
      .references(() => node.id, { onDelete: "cascade" }),
    fromOutput: text("from_output").default("main").notNull(),
    toInput: text("to_input").default("main").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    uniqueConnection: uniqueIndex("connection_from_to_output_input_unique").on(
      table.fromNodeId,
      table.toNodeId,
      table.fromOutput,
      table.toInput,
    ),
  }),
);

export const connectionRelations = relations(connection, ({ one }) => ({
  workflow: one(workflow, {
    fields: [connection.workflowId],
    references: [workflow.id],
  }),
}));
