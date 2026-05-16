"use server";

import { db } from "@/db";
import { invoices } from "@/db/schema/invoices";
import { invoiceLineItems } from "@/db/schema/invoice_line_items";
import { invoiceActivities } from "@/db/schema/invoice_activities";
import { invoiceSchema } from "@/lib/validations/invoice";
import { requireAuth } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { InvoiceInput } from "@/types/invoice";

export async function createInvoiceAction(data: InvoiceInput) {
  const session = await requireAuth();
  
  const parsed = invoiceSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { customerId, description, dueDate, templateId, notes, terms, taxRate, discountAmount, lineItems } = parsed.data;

  // Calculate Totals securely on the backend
  let subtotalCents = 0;
  
  const processedLineItems = lineItems.map((item) => {
    const unitPriceCents = Math.round(item.unitPrice * 100);
    const totalCents = unitPriceCents * item.quantity;
    subtotalCents += totalCents;
    return {
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

  let newInvoiceId = "";

  try {
    const result = await db.insert(invoices).values({
      userId: session.userId,
      customerId,
      invoiceNumber: `INV-${Math.floor(Date.now() / 1000)}`,
      description,
      subtotalCents,
      taxCents,
      discountCents,
      amountCents,
      dueDate: new Date(dueDate),
      status: "draft",
      templateId,
      notes,
      terms,
    }).returning({ id: invoices.id });
    
    newInvoiceId = result[0].id;

    // Insert line items
    await db.insert(invoiceLineItems).values(
      processedLineItems.map(item => ({
        ...item,
        invoiceId: newInvoiceId,
      }))
    );

    // Log creation activity
    await db.insert(invoiceActivities).values({
      invoiceId: newInvoiceId,
      type: "creation",
      description: "Invoice created as Draft",
    });

  } catch (error) {
    console.error(error);
    return { error: "Failed to create invoice" };
  }

  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  redirect(`/invoices/${newInvoiceId}`);
}
