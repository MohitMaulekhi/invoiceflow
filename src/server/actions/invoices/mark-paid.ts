"use server";

import { db } from "@/db";
import { invoices } from "@/db/schema/invoices";
import { invoiceActivities } from "@/db/schema/invoice_activities";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

export async function markAsPaidAction(invoiceId: string) {
  const session = await requireAuth();

  try {
    await db
      .update(invoices)
      .set({ status: "paid" })
      .where(and(eq(invoices.id, invoiceId), eq(invoices.userId, session.userId)));
      
    await db.insert(invoiceActivities).values({
      invoiceId: invoiceId,
      type: "payment",
      description: "Invoice marked as paid",
    });
      
    revalidatePath(`/invoices/${invoiceId}`);
    revalidatePath("/invoices");
    revalidatePath("/dashboard");
  } catch{
    throw new Error("Failed to mark invoice as paid");
  }
}
