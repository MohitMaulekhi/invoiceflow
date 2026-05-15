"use server";

import { db } from "@/db";
import { invoices } from "@/db/schema/invoices";
import { invoiceSchema } from "@/lib/validations/invoice";
import { requireAuth } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createInvoiceAction(prevState: any, formData: FormData) {
  const session = await requireAuth();
  const data = Object.fromEntries(formData.entries());
  
  const parsed = invoiceSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { customerId, description, amount, dueDate } = parsed.data;
  const amountCents = Math.round(parseFloat(amount) * 100);

  let newInvoiceId = "";

  try {
    const result = await db.insert(invoices).values({
      userId: session.userId,
      customerId,
      description,
      amountCents,
      dueDate: new Date(dueDate),
      status: "pending",
    }).returning({ id: invoices.id });
    
    newInvoiceId = result[0].id;
  } catch (error) {
    console.error(error);
    return { error: "Failed to create invoice" };
  }

  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  redirect(`/invoices/${newInvoiceId}`);
}
