"use server";

import { db } from "@/db";
import { invoices } from "@/db/schema/invoices";
import { invoiceLineItems } from "@/db/schema/invoice_line_items";
import { invoiceSchema } from "@/lib/validations/invoice";
import { requireAuth } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, and } from "drizzle-orm";
import type { InvoiceInput } from "@/types/invoice";

export async function updateInvoiceAction(invoiceId: string, data: InvoiceInput) {
  const session = await requireAuth();
  
  const parsed = invoiceSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { customerId, description, dueDate, templateId, notes, terms, taxRate, discountAmount, lineItems } = parsed.data;

  // Verify ownership
  const existingInvoice = await db.select().from(invoices).where(and(eq(invoices.id, invoiceId), eq(invoices.userId, session.userId))).limit(1);
  if (existingInvoice.length === 0) {
    return { error: "Invoice not found or unauthorized" };
  }

  let subtotalCents = 0;
  const processedLineItems = lineItems.map((item) => {
    const unitPriceCents = Math.round(item.unitPrice * 100);
    const totalCents = unitPriceCents * item.quantity;
    subtotalCents += totalCents;
    return {
      invoiceId,
      description: item.description,
      quantity: item.quantity,
      unitPriceCents,
      totalCents,
    };
  });

  const discountCents = Math.round(discountAmount * 100);
  const taxableAmountCents = Math.max(0, subtotalCents - discountCents);
  const taxCents = Math.round(taxableAmountCents * (taxRate / 100));
  const amountCents = taxableAmountCents + taxCents;

  try {
    // Update invoice
    await db.update(invoices).set({
      customerId,
      description,
      subtotalCents,
      taxCents,
      discountCents,
      amountCents,
      dueDate: new Date(dueDate),
      templateId,
      notes,
      terms,
    }).where(eq(invoices.id, invoiceId));

    // Delete existing line items and insert new ones
    await db.delete(invoiceLineItems).where(eq(invoiceLineItems.invoiceId, invoiceId));
    await db.insert(invoiceLineItems).values(processedLineItems);

  } catch  {
    return { error: "Failed to update invoice" };
  }

  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  revalidatePath(`/invoices/${invoiceId}`);
  redirect(`/invoices/${invoiceId}`);
}
