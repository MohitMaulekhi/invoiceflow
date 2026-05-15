import { pgTable, text, timestamp, integer, pgEnum, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { customers } from "./customers";

export const invoiceStatusEnum = pgEnum("invoice_status", [
  "draft", 
  "sent", 
  "viewed", 
  "partially_paid", 
  "paid", 
  "overdue", 
  "voided"
]);

export const invoiceTemplateEnum = pgEnum("invoice_template", [
  "minimal",
  "modern",
  "classic",
  "bold",
  "elegant"
]);

export const invoices = pgTable("invoices", {
  id: uuid("id").defaultRandom().primaryKey(),
  invoiceNumber: text("invoice_number").notNull(), // e.g. INV-001
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  customerId: uuid("customer_id")
    .references(() => customers.id, { onDelete: "cascade" })
    .notNull(),
  
  // Totals Breakdown
  amountCents: integer("amount_cents").notNull(), // the grand total
  subtotalCents: integer("subtotal_cents").default(0).notNull(),
  taxCents: integer("tax_cents").default(0).notNull(),
  discountCents: integer("discount_cents").default(0).notNull(),

  status: invoiceStatusEnum("status").default("draft").notNull(),
  templateId: invoiceTemplateEnum("template_id").default("minimal").notNull(),
  
  dueDate: timestamp("due_date").notNull(),
  description: text("description").notNull(), // Overall invoice description/title
  
  notes: text("notes"), // E.g. "Thank you for your business"
  terms: text("terms"), // E.g. "Net 30. Late fees apply after 30 days."

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
