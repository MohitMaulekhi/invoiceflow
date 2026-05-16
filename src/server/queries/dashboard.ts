import { db } from "@/db";
import { invoices } from "@/db/schema/invoices";
import { customers } from "@/db/schema/customers";
import { invoiceLineItems } from "@/db/schema/invoice_line_items";
import { eq, desc } from "drizzle-orm";
import { subDays, startOfDay } from "date-fns";

export async function getDashboardData(userId: string) {
  // 1. Basic Stats
  const allInvoices = await db.select().from(invoices).where(eq(invoices.userId, userId));
  
  const stats = allInvoices.reduce(
    (acc, inv) => {
      acc.totalCount++;
      if (inv.status === "paid") {
        acc.paidAmount += inv.amountCents;
      } else if (inv.status === "overdue") {
        acc.overdueCount++;
        acc.overdueAmount += inv.amountCents;
      } else if (["draft", "sent", "viewed", "partially_paid"].includes(inv.status)) {
        acc.pendingCount++;
        acc.unpaidAmount += inv.amountCents;
      }
      return acc;
    },
    { totalCount: 0, paidAmount: 0, unpaidAmount: 0, overdueAmount: 0, overdueCount: 0, pendingCount: 0 }
  );

  // 2. Weekly Sales Data (Last 7 Days)
  const sevenDaysAgo = startOfDay(subDays(new Date(), 6));
  const recentInvoices = allInvoices.filter(i => new Date(i.createdAt) >= sevenDaysAgo);
  
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklySalesMap = new Map<string, number>();
  const weeklyPaidMap = new Map<string, number>();
  const weeklyPendingMap = new Map<string, number>();
  
  // Initialize last 7 days with 0
  for (let i = 6; i >= 0; i--) {
    const d = subDays(new Date(), i);
    const dayName = daysOfWeek[d.getDay()];
    weeklySalesMap.set(dayName, 0);
    weeklyPaidMap.set(dayName, 0);
    weeklyPendingMap.set(dayName, 0);
  }

  recentInvoices.forEach(inv => {
    const dayName = daysOfWeek[new Date(inv.createdAt).getDay()];
    if (weeklySalesMap.has(dayName)) {
      weeklySalesMap.set(dayName, weeklySalesMap.get(dayName)! + (inv.amountCents / 100));
      if (inv.status === "paid") {
        weeklyPaidMap.set(dayName, weeklyPaidMap.get(dayName)! + (inv.amountCents / 100));
      } else {
        weeklyPendingMap.set(dayName, weeklyPendingMap.get(dayName)! + (inv.amountCents / 100));
      }
    }
  });

  const weeklySales = Array.from(weeklySalesMap.entries()).map(([name, total]) => ({
    name,
    total
  }));

  const receivedData = Array.from(weeklyPaidMap.entries()).map(([name, value]) => ({
    name,
    value
  }));

  const orderedData = Array.from(weeklyPendingMap.entries()).map(([name, value]) => ({
    name,
    value
  }));

  // 3. Recent Sales (List)
  const recentSalesList = await db
    .select({
      id: invoices.id,
      amountCents: invoices.amountCents,
      status: invoices.status,
      createdAt: invoices.createdAt,
      customerName: customers.name,
      customerCompany: customers.companyName,
    })
    .from(invoices)
    .innerJoin(customers, eq(invoices.customerId, customers.id))
    .where(eq(invoices.userId, userId))
    .orderBy(desc(invoices.createdAt))
    .limit(5);

  // 4. Top Item Sales
  // We'll get all line items for this user's invoices
  const userInvoicesIds = allInvoices.map(i => i.id);
  
  let topItems: Array<{ name: string; totalCents: number }> = [];
  if (userInvoicesIds.length > 0) {
    const allItems = await db
      .select({
        description: invoiceLineItems.description,
        totalCents: invoiceLineItems.totalCents,
      })
      .from(invoiceLineItems)
      .innerJoin(invoices, eq(invoices.id, invoiceLineItems.invoiceId))
      .where(eq(invoices.userId, userId));
      
    const itemMap = new Map<string, number>();
    allItems.forEach(item => {
      itemMap.set(item.description, (itemMap.get(item.description) || 0) + item.totalCents);
    });
    
    topItems = Array.from(itemMap.entries())
      .map(([name, totalCents]) => ({ name, totalCents }))
      .sort((a, b) => b.totalCents - a.totalCents)
      .slice(0, 4);
  }

  return {
    stats,
    weeklySales,
    receivedData,
    orderedData,
    recentSalesList,
    topItems,
    totalAmount: stats.paidAmount + stats.unpaidAmount + stats.overdueAmount
  };
}
