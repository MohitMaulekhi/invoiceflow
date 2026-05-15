import { pgTable, timestamp, pgEnum, uuid } from "drizzle-orm/pg-core";
import { invoices } from "./invoices";

export const reminderStatusEnum = pgEnum("reminder_status", ["sent", "failed"]);

export const reminders = pgTable("reminders", {
  id: uuid("id").defaultRandom().primaryKey(),
  invoiceId: uuid("invoice_id")
    .references(() => invoices.id, { onDelete: "cascade" })
    .notNull(),
  status: reminderStatusEnum("status").default("sent").notNull(),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
});
