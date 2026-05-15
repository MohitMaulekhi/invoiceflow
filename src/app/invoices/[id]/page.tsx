import { getInvoiceById } from "@/server/queries/invoices";
import { getUserProfile } from "@/server/queries/users";
import { requireAuth } from "@/lib/auth/session";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { format } from "date-fns";
import { InvoiceViewer } from "@/components/invoices/invoice-viewer";

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  const resolvedParams = await params;
  const invoiceId = resolvedParams.id;

  const data = await getInvoiceById(session.userId, invoiceId);
  const userProfile = await getUserProfile(session.userId);

  if (!data) {
    notFound();
  }
  
  const { invoice, customer, reminders, lineItems } = data;

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <div>
        <Link href="/invoices" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to invoices
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Invoice #{invoice.invoiceNumber}</h1>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 items-start">
        {/* Main Invoice Viewer & Actions */}
        <div className="flex-1 w-full">
          <InvoiceViewer 
            invoice={invoice as any} 
            customer={customer as any} 
            lineItems={lineItems as any} 
            userProfile={userProfile as any}
          />
        </div>

        {/* Sidebar Timeline & History */}
        <div className="w-full xl:w-[400px] shrink-0 space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-xl pb-4">
              <CardTitle className="text-lg text-primary flex items-center gap-2">
                <Clock className="w-5 h-5" /> Activity Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                
                {/* Creation Event */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-3 h-3 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-emerald-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-slate-100 bg-slate-50 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold text-slate-900 text-sm">Invoice Created</div>
                      <div className="text-xs text-slate-500 font-medium">{format(new Date(invoice.createdAt), "MMM d")}</div>
                    </div>
                    <div className="text-xs text-slate-500">
                      Drafted successfully
                    </div>
                  </div>
                </div>

                {/* Reminder Events */}
                {reminders.map((rem: any) => (
                  <div key={rem.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-3 h-3 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />
                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-slate-100 bg-slate-50 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-semibold text-slate-900 text-sm">Reminder {rem.status === 'sent' ? 'Sent' : 'Failed'}</div>
                        <div className="text-xs text-slate-500 font-medium">{format(new Date(rem.sentAt), "MMM d")}</div>
                      </div>
                      <div className="text-xs text-slate-500">
                        {format(new Date(rem.sentAt), "h:mm a")}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Payment Event */}
                {invoice.status === 'paid' && (
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-3 h-3 rounded-full border border-white bg-emerald-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />
                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-emerald-100 bg-emerald-50 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-semibold text-emerald-900 text-sm">Marked as Paid</div>
                      </div>
                      <div className="text-xs text-emerald-700">
                        Payment received in full
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
