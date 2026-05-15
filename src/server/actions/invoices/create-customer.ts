"use server";

import { db } from "@/db";
import { customers } from "@/db/schema/customers";
import { customerSchema } from "@/lib/validations/invoice";
import { requireAuth } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCustomerAction(prevState: any, formData: FormData) {
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
    });
  } catch (error: any) {
    if (error.code === '23505') { // unique violation
      return { error: "A customer with this email already exists." };
    }
    return { error: "Failed to create customer." };
  }

  revalidatePath("/customers");
  redirect("/customers");
}
