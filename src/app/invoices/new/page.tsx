import { getCustomers } from "@/server/queries/customers";
import { getUserProfile } from "@/server/queries/users";
import { requireAuth } from "@/lib/auth/session";
import { InvoiceBuilder } from "@/components/forms/invoice-builder";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewInvoicePage() {
  const session = await requireAuth();
  const customers = await getCustomers(session.userId);
  const userProfile = await getUserProfile(session.userId);

  return (
    <div className="max-w-350 mx-auto space-y-6">
      <div>
        <Link href="/invoices" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to invoices
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Invoice Builder</h1>
        <p className="text-slate-500 mt-2">Create professional invoices and see the live preview instantly.</p>
      </div>

      <InvoiceBuilder customers={customers} userProfile={userProfile} />
    </div>
  );
}
