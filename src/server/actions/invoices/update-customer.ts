"use server";

import { db } from "@/db";
import { customers } from "@/db/schema/customers";
import { customerSchema } from "@/lib/validations/invoice";
import { requireAuth } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";

export async function updateCustomerAction(prevState: any, formData: FormData) {
  const session = await requireAuth();
  const data = Object.fromEntries(formData.entries());
  
  const customerId = data.id as string;
  if (!customerId) return { error: "Customer ID is required." };

  const parsed = customerSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await db.update(customers).set({
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      companyName: parsed.data.companyName || null,
      taxId: parsed.data.taxId || null,
      addressLine1: parsed.data.addressLine1 || null,
      city: parsed.data.city || null,
      state: parsed.data.state || null,
      zip: parsed.data.zip || null,
      country: parsed.data.country || null,
    }).where(and(eq(customers.id, customerId), eq(customers.userId, session.userId)));
    
    revalidatePath("/customers");
    return { success: true };
  } catch (error: any) {
    if (error.code === '23505') { // unique violation
      return { error: "A customer with this email already exists." };
    }
    return { error: "Failed to update customer." };
  }
}
