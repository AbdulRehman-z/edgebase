import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

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
