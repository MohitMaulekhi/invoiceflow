"use server";

import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(prevState: any, formData: FormData) {
  const session = await requireAuth();
  const name = formData.get("name") as string;
  const businessName = formData.get("businessName") as string;
  const businessAddress = formData.get("businessAddress") as string;
  const businessPhone = formData.get("businessPhone") as string;

  if (!name || !businessName) {
    return { error: "Name and Business Name are required." };
  }

  try {
    await db.update(users).set({
      name,
      businessName,
      businessAddress: businessAddress || null,
      businessPhone: businessPhone || null,
    }).where(eq(users.id, session.userId));

    revalidatePath("/settings");
    revalidatePath("/invoices");
    revalidatePath("/dashboard");
    return { success: "Profile updated successfully." };
  } catch (error) {
    console.error("Update profile error:", error);
    return { error: "Failed to update profile." };
  }
}
