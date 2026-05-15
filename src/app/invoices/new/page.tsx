import { getCustomers } from "@/server/queries/customers";
import { requireAuth } from "@/lib/auth/session";
import { InvoiceForm } from "@/components/forms/invoice-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewInvoicePage() {
  const session = await requireAuth();
  const customers = await getCustomers(session.userId);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/invoices" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to invoices
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Create Invoice</h1>
      </div>

      <InvoiceForm customers={customers} />
    </div>
  );
}
