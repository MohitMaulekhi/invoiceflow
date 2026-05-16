import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";


export async function getUserProfile(userId: string) {
  const userQuery = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      businessName: users.businessName,
      businessAddress: users.businessAddress,
      businessPhone: users.businessPhone,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return userQuery[0] || null;
}
