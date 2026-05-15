import { db } from "@/db";
import { invoices } from "@/db/schema/invoices";
import { eq } from "drizzle-orm";

export async function getDashboardStats(userId: string) {
  const allInvoices = await db.select().from(invoices).where(eq(invoices.userId, userId));
  
  const stats = allInvoices.reduce(
    (acc, inv) => {
      acc.totalCount++;
      if (inv.status === "paid") {
        acc.paidAmount += inv.amountCents;
      } else if (inv.status === "overdue") {
        acc.overdueCount++;
        acc.overdueAmount += inv.amountCents;
      } else if (inv.status === "pending") {
        acc.pendingCount++;
        acc.unpaidAmount += inv.amountCents;
      }
      return acc;
    },
    { totalCount: 0, paidAmount: 0, unpaidAmount: 0, overdueAmount: 0, overdueCount: 0, pendingCount: 0 }
  );

  return stats;
}
