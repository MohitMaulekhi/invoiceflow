"use server";

import { db } from "@/db";
import { invoices } from "@/db/schema/invoices";
import { invoiceActivities } from "@/db/schema/invoice_activities";
import { requireAuth } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { canTransitionTo } from "@/lib/invoice-states";
import type { InvoiceStatus } from "@/types/invoice";

export async function updateInvoiceStatusAction(invoiceId: string, status: InvoiceStatus) {
  const session = await requireAuth();

  if (!invoiceId || !status) throw new Error("Invoice ID and status are required.");

  try {
    const existingInvoice = await db.select({ status: invoices.status }).from(invoices).where(and(eq(invoices.id, invoiceId), eq(invoices.userId, session.userId))).limit(1);
    if (existingInvoice.length === 0) throw new Error("Invoice not found or unauthorized");

    const currentStatus = existingInvoice[0].status as InvoiceStatus;
    
    if (!canTransitionTo(currentStatus, status)) {
      throw new Error(`Cannot transition invoice from ${currentStatus} to ${status}`);
    }

    await db.update(invoices).set({ status }).where(and(eq(invoices.id, invoiceId), eq(invoices.userId, session.userId)));
    
    await db.insert(invoiceActivities).values({
      invoiceId: invoiceId,
      type: "status_change",
      description: `Status changed from ${currentStatus.replace("_", " ")} to ${status.replace("_", " ")}`,
    });
    
    revalidatePath("/invoices");
    revalidatePath("/dashboard");
    revalidatePath(`/invoices/${invoiceId}`);
    return { success: true };
  } catch (error) {
    console.error("Update invoice status error:", error);
    throw new Error("Failed to update invoice status.");
  }
}
