import { getInvoices } from "@/server/queries/invoices";
import { requireAuth } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { InvoiceList } from "@/components/invoices/invoice-list";
import type { InvoiceListItem } from "@/types/invoice";

export default async function InvoicesPage() {
  const session = await requireAuth();

  let invoiceList: InvoiceListItem[] = [];
  try {
    invoiceList = await getInvoices(session.userId);
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="max-w-400 mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Invoices</h1>
          <p className="text-slate-500 mt-2">Manage and track your invoices.</p>
        </div>
        <Link href="/invoices/new">
          <Button className="rounded-xl font-bold shadow-md shadow-primary/20 hover:scale-[1.02] transition-transform px-6 py-5">
            Create Invoice
          </Button>
        </Link>
      </div>

      <InvoiceList initialInvoices={invoiceList} />
    </div>
  );
}
