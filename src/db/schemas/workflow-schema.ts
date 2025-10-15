import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const workflow = pgTable("workflow", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});
