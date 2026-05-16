import { relations } from "drizzle-orm";
import { users } from "../schema/users";
import { customers } from "../schema/customers";
import { invoices } from "../schema/invoices";
import { reminders } from "../schema/reminders";
import { invoiceLineItems } from "../schema/invoice_line_items";
import { invoiceActivities } from "../schema/invoice_activities";

export const usersRelations = relations(users, ({ many }) => ({
  customers: many(customers),
  invoices: many(invoices),
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
  user: one(users, {
    fields: [customers.userId],
    references: [users.id],
  }),
  invoices: many(invoices),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  user: one(users, {
    fields: [invoices.userId],
    references: [users.id],
  }),
  customer: one(customers, {
    fields: [invoices.customerId],
    references: [customers.id],
  }),
  reminders: many(reminders),
  lineItems: many(invoiceLineItems),
  activities: many(invoiceActivities),
}));

export const invoiceLineItemsRelations = relations(invoiceLineItems, ({ one }) => ({
  invoice: one(invoices, {
    fields: [invoiceLineItems.invoiceId],
    references: [invoices.id],
  }),
}));

export const remindersRelations = relations(reminders, ({ one }) => ({
  invoice: one(invoices, {
    fields: [reminders.invoiceId],
    references: [invoices.id],
  }),
}));

export const invoiceActivitiesRelations = relations(invoiceActivities, ({ one }) => ({
  invoice: one(invoices, {
    fields: [invoiceActivities.invoiceId],
    references: [invoices.id],
  }),
}));
