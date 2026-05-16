"use server";

import { db } from "@/db";
import { customers } from "@/db/schema/customers";
import { customerSchema } from "@/lib/validations/invoice";
import { requireAuth } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

function isUniqueViolationError(error: unknown): error is { code: string } {
  return typeof error === "object" && error !== null && "code" in error && typeof error.code === "string";
}

export async function createCustomerAction(formData: FormData) {
  const session = await requireAuth();
  const data = Object.fromEntries(formData.entries());
  
  const parsed = customerSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await db.insert(customers).values({
      userId: session.userId,
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
    });
  } catch (error: unknown) {
    if (isUniqueViolationError(error) && error.code === "23505") {
      return { error: "A customer with this email already exists." };
    }
    return { error: "Failed to create customer." };
  }

  revalidatePath("/customers");
  return { success: true };
}
