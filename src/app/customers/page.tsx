import { getCustomers } from "@/server/queries/customers";
import { requireAuth } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CustomerGrid } from "@/components/customers/customer-grid";

export default async function CustomersPage() {
  const session = await requireAuth();
  
  let customerList: any[] = [];
  try {
    customerList = await getCustomers(session.userId);
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Customers</h1>
          <p className="text-slate-500 mt-2">Manage people and businesses who owe you money.</p>
        </div>
      </div>

      <CustomerGrid initialCustomers={customerList} />
    </div>
  );
}
