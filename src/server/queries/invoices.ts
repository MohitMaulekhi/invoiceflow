import { db } from "@/db";
import { customers } from "@/db/schema/customers";
import { invoices } from "@/db/schema/invoices";
import { invoiceActivities } from "@/db/schema/invoice_activities";
import { invoiceLineItems } from "@/db/schema/invoice_line_items";
import type { InvoiceDetail, InvoiceListItem, InvoiceStatusFilter } from "@/types/invoice";
import { eq, desc, asc, and, ilike, or, type SQL } from "drizzle-orm";

export async function getInvoices(
  userId: string,
  query?: string,
  statusFilter?: InvoiceStatusFilter
): Promise<InvoiceListItem[]> {
  const conditions: SQL<unknown>[] = [eq(invoices.userId, userId)];

  if (query) {
    conditions.push(
      or(
        ilike(customers.name, `%${query}%`),
        ilike(invoices.description, `%${query}%`)
      )!
    );
  }

  if (statusFilter && statusFilter !== "all") {
    conditions.push(eq(invoices.status, statusFilter));
  }

  return db
    .select({
      id: invoices.id,
      amountCents: invoices.amountCents,
      status: invoices.status,
      dueDate: invoices.dueDate,
      description: invoices.description,
      customerName: customers.name,
      createdAt: invoices.createdAt,
    })
    .from(invoices)
    .innerJoin(customers, eq(invoices.customerId, customers.id))
    .where(and(...conditions))
    .orderBy(desc(invoices.createdAt));
}

export async function getInvoiceById(
  userId: string,
  invoiceId: string
): Promise<InvoiceDetail | null> {
  const invoiceQuery = await db
    .select()
    .from(invoices)
    .where(and(eq(invoices.id, invoiceId), eq(invoices.userId, userId)))
    .limit(1);

  if (invoiceQuery.length === 0) return null;
  const invoice = invoiceQuery[0];

  const [customerQuery, activities, lineItems] = await Promise.all([
    db
      .select()
      .from(customers)
      .where(and(eq(customers.id, invoice.customerId), eq(customers.userId, userId)))
      .limit(1),
    db
      .select()
      .from(invoiceActivities)
      .where(eq(invoiceActivities.invoiceId, invoiceId))
      .orderBy(asc(invoiceActivities.createdAt)),
    db
      .select()
      .from(invoiceLineItems)
      .where(eq(invoiceLineItems.invoiceId, invoiceId)),
  ]);

  const customer = customerQuery[0];
  if (!customer) return null;

  return {
    invoice,
    customer,
    activities,
    lineItems,
  };
}
