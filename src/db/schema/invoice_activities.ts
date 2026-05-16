import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { invoices } from "./invoices";

export const invoiceActivities = pgTable("invoice_activities", {
  id: uuid("id").defaultRandom().primaryKey(),
  invoiceId: uuid("invoice_id")
    .references(() => invoices.id, { onDelete: "cascade" })
    .notNull(),
  type: text("type").notNull(), // 'status_change', 'creation', 'payment', 'reminder'
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
