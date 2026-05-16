"use server";

import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signInSchema } from "@/lib/validations/auth";
import { createSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";


export async function signInAction(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const parsed = signInSchema.safeParse(data);
  
  if (!parsed.success) {
    return { error: "Invalid input" };
  }

  const { email, password } = parsed.data;

  try {
    const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (userResult.length === 0) {
      return { error: "Invalid email or password" };
    }

    const user = userResult[0];
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return { error: "Invalid email or password" };
    }

    await createSession({
      userId: user.id,
      email: user.email,
    });

  } catch {
    return { error: "Something went wrong" };
  }

  redirect("/dashboard");
}
