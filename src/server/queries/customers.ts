import { db } from "@/db";
import { customers } from "@/db/schema/customers";
import { eq, desc } from "drizzle-orm";

export async function getCustomers(userId: string) {
  return db
    .select()
    .from(customers)
    .where(eq(customers.userId, userId))
    .orderBy(desc(customers.createdAt));
}
