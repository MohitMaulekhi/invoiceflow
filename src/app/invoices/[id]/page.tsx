import { getInvoiceById } from "@/server/queries/invoices";
import { getUserProfile } from "@/server/queries/users";
import { requireAuth } from "@/lib/auth/session";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { InvoiceViewer } from "@/components/invoices/invoice-viewer";
import { cn } from "@/lib/utils";
import { formatMoney } from "@/components/invoices/templates/utils";
import { invoiceActivities } from "@/db/schema/invoice_activities";

const formatIST = (dateStr: string | Date) => {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(new Date(dateStr));
};

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  const resolvedParams = await params;
  const invoiceId = resolvedParams.id;

  const data = await getInvoiceById(session.userId, invoiceId);
  const userProfile = await getUserProfile(session.userId);

  if (!data) {
    notFound();
  }
  
  const { invoice, customer, activities, lineItems } = data;

  return (
    <div className="max-w-350 mx-auto space-y-6">
      <div>
        <Link href="/invoices" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to invoices
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Invoice #{invoice.invoiceNumber}</h1>
            <span className={cn(
              "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mt-1",
              invoice.status === 'paid' ? "bg-emerald-50 text-emerald-600" : 
              invoice.status === 'overdue' ? "bg-rose-50 text-rose-600" : 
              invoice.status === 'voided' ? "bg-slate-100 text-slate-600" :
              "bg-amber-50 text-amber-600"
            )}>
              {invoice.status.replace("_", " ")}
            </span>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Total Due</p>
            <p className="text-3xl font-black text-slate-900">{formatMoney(invoice.amountCents)}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 items-start">
        {/* Main Invoice Viewer & Actions */}
        <div className="flex-1 w-full">
          <InvoiceViewer 
            invoice={invoice} 
            customer={customer} 
            lineItems={lineItems} 
            userProfile={userProfile}
          />
        </div>

        {/* Sidebar Timeline & History */}
        <div className="w-full xl:w-100 shrink-0 space-y-6">
          <Card className="shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 rounded-[32px] bg-white overflow-hidden">
            <CardHeader className="bg-white border-b border-slate-100 pb-4 p-8">
              <CardTitle className="text-lg text-slate-900 font-bold tracking-tight flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-400" /> Activity Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 md:before:mx-auto xl:before:mx-0 xl:before:ml-5 before:h-full before:w-px before:bg-slate-200">
                
                {(!activities.length || activities[0]?.type !== 'creation') && (
                  <div className="relative flex items-center justify-end group">
                    <div className="absolute left-5 md:left-1/2 xl:left-5 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-[6px] ring-white shrink-0 z-10" />
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] xl:w-[calc(100%-4rem)] p-5 rounded-2xl border border-slate-100 bg-[#f8fafc] shadow-sm">
                      <div className="flex flex-wrap items-start justify-between mb-2 gap-x-4 gap-y-1">
                        <div className="font-bold text-slate-800 text-sm leading-tight">Invoice Created</div>
                        <div className="text-xs text-slate-500 font-medium whitespace-nowrap">{formatIST(invoice.createdAt)}</div>
                      </div>
                      <div className="text-xs text-slate-500">
                        Drafted successfully
                      </div>
                    </div>
                  </div>
                )}

                {activities.map((act: typeof invoiceActivities.$inferSelect, index: number) => {
                  const isCreationInjected = !activities.length || activities[0]?.type !== 'creation';
                  const visualIndex = isCreationInjected ? index + 1 : index;
                  const isLeft = visualIndex % 2 !== 0;

                  return (
                  <div key={act.id} className={cn("relative flex items-center group", isLeft ? "justify-end md:justify-start xl:justify-end" : "justify-end")}>
                    <div className={cn(
                      "absolute left-5 md:left-1/2 xl:left-5 -translate-x-1/2 w-2.5 h-2.5 rounded-full ring-[6px] ring-white shrink-0 z-10",
                      act.type === 'creation' || act.type === 'payment' ? "bg-emerald-500" : 
                      act.type === 'status_change' ? "bg-amber-500" : 
                      "bg-teal-600"
                    )} />
                    <div className={cn(
                      "w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] xl:w-[calc(100%-4rem)] p-5 rounded-2xl shadow-sm",
                      act.type === 'creation' || act.type === 'payment' ? "bg-[#f8fafc] border border-slate-100" :
                      act.type === 'status_change' ? "bg-[#fefced] border border-[#fef08a]" :
                      "bg-[#f8fafc] border border-slate-100"
                    )}>
                      <div className="flex flex-wrap items-start justify-between mb-2 gap-x-4 gap-y-1">
                        <div className={cn(
                          "font-bold text-sm leading-tight",
                          act.type === 'creation' || act.type === 'payment' ? "text-slate-800" :
                          act.type === 'status_change' ? "text-[#92400e]" :
                          "text-slate-800"
                        )}>
                          {act.type === 'creation' ? "Invoice Created" :
                           act.type === 'payment' ? "Payment Recorded" :
                           act.type === 'reminder' ? "Reminder Sent" :
                           "Status Updated"}
                        </div>
                        <div className="text-xs text-slate-500 font-medium whitespace-nowrap">{formatIST(act.createdAt)}</div>
                      </div>
                      <div className={cn(
                        "text-xs leading-relaxed",
                        act.type === 'creation' || act.type === 'payment' ? "text-slate-500" :
                        act.type === 'status_change' ? "text-[#d97706]" :
                        "text-slate-500"
                      )}>
                        {act.description}
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
