import { getCustomers } from "@/server/queries/customers";
import { getUserProfile } from "@/server/queries/users";
import { getInvoiceById } from "@/server/queries/invoices";
import { requireAuth } from "@/lib/auth/session";
import { InvoiceBuilder } from "@/components/forms/invoice-builder";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  const resolvedParams = await params;
  const invoiceId = resolvedParams.id;

  const data = await getInvoiceById(session.userId, invoiceId);
  if (!data) notFound();

  const customers = await getCustomers(session.userId);
  const userProfile = await getUserProfile(session.userId);

  return (
    <div className="max-w-350 mx-auto space-y-6">
      <div>
        <Link href={`/invoices/${invoiceId}`} className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to invoice
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Invoice</h1>
        <p className="text-slate-500 mt-2">Update your invoice details and see the live preview instantly.</p>
      </div>

      <InvoiceBuilder customers={customers} userProfile={userProfile} initialData={data} />
    </div>
  );
}
