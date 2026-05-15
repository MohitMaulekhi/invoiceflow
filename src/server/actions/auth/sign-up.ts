"use server";

import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signUpSchema, SignUpInput } from "@/lib/validations/auth";
import { createSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export async function signUpAction(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const parsed = signUpSchema.safeParse(data);
  
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { email, password, name, businessName } = parsed.data;

  try {
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (existingUser.length > 0) {
      return { error: "Email is already in use" };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await db.insert(users).values({
      email,
      name,
      businessName,
      passwordHash,
    }).returning({ id: users.id, email: users.email });

    const newUser = result[0];

    await createSession({
      userId: newUser.id,
      email: newUser.email,
    });

  } catch (error) {
    console.error("Sign up error:", error);
    return { error: "Something went wrong" };
  }

  redirect("/dashboard");
}
