"use server";

import { db } from "@/db";
import { customers } from "@/db/schema/customers";
import { requireAuth } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";

export async function deleteCustomerAction(customerId: string) {
  const session = await requireAuth();
  
  if (!customerId) throw new Error("Customer ID is required.");

  try {
    await db.delete(customers)
      .where(and(eq(customers.id, customerId), eq(customers.userId, session.userId)));
    
    revalidatePath("/customers");
    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    throw new Error("Failed to delete customer.");
  }
}
