"use server";

import { db } from "@/db";
import { invoices } from "@/db/schema/invoices";
import { invoiceLineItems } from "@/db/schema/invoice_line_items";
import { requireAuth } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";

export async function deleteInvoiceAction(invoiceId: string) {
  const session = await requireAuth();

  if (!invoiceId) throw new Error("Invoice ID is required.");

  try {
    await db.delete(invoiceLineItems).where(eq(invoiceLineItems.invoiceId, invoiceId));
    await db.delete(invoices).where(and(eq(invoices.id, invoiceId), eq(invoices.userId, session.userId)));
    
    revalidatePath("/invoices");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Delete invoice error:", error);
    throw new Error("Failed to delete invoice.");
  }
}
