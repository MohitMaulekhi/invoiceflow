import { getInvoiceById } from "@/server/queries/invoices";
import { requireAuth } from "@/lib/auth/session";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Send, CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { markAsPaidAction } from "@/server/actions/invoices/mark-paid";
import { sendReminderAction } from "@/server/actions/reminders/send-reminder";

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  const resolvedParams = await params;
  const invoiceId = resolvedParams.id;

  const data = await getInvoiceById(session.userId, invoiceId);

  if (!data) {
    notFound();
  }
  
  const { invoice, customer, reminders } = data;

  const formatMoney = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const isPaid = invoice.status === "paid";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Link href="/invoices" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to invoices
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Invoice Details</h1>
          <div className="flex gap-2">
            {!isPaid && (
              <form action={async () => {
                "use server";
                await sendReminderAction(invoiceId);
              }}>
                <Button variant="outline" type="submit" className="gap-2">
                  <Send className="w-4 h-4" /> Send Reminder
                </Button>
              </form>
            )}
            
            {!isPaid && (
              <form action={async () => {
                "use server";
                await markAsPaidAction(invoiceId);
              }}>
                <Button type="submit" className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                  <CheckCircle className="w-4 h-4" /> Mark as Paid
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-xl">{invoice.description}</CardTitle>
                <CardDescription className="mt-1">
                  Created on {format(new Date(invoice.createdAt), "MMM d, yyyy")}
                </CardDescription>
              </div>
              <span className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                invoice.status === 'paid' ? "bg-emerald-50 text-emerald-700 border-emerald-200" : 
                invoice.status === 'overdue' ? "bg-rose-50 text-rose-700 border-rose-200" : 
                "bg-amber-50 text-amber-700 border-amber-200"
              )}>
                {invoice.status.toUpperCase()}
              </span>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end mt-4 pt-6 border-t">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Amount Due</p>
                  <p className="text-3xl font-bold">{formatMoney(invoice.amountCents)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-500 mb-1">Due Date</p>
                  <p className="font-semibold text-slate-900">{format(new Date(invoice.dueDate), "MMM d, yyyy")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">Name</p>
                  <p className="font-medium">{customer.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Email Address</p>
                  {customer.email ? (
                    <a href={`mailto:${customer.email}`} className="text-blue-600 hover:underline">{customer.email}</a>
                  ) : (
                    <span className="text-slate-400">No email provided</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-400" /> Reminder History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reminders.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No reminders sent yet.</p>
              ) : (
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  {reminders.map((rem: any) => (
                    <div key={rem.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-4 h-4 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded border border-slate-100 bg-slate-50 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-medium text-slate-900 text-sm">Reminder {rem.status === 'sent' ? 'Sent' : 'Failed'}</div>
                          <div className="text-xs text-slate-500">{format(new Date(rem.sentAt), "MMM d")}</div>
                        </div>
                        <div className="text-xs text-slate-500">
                          {format(new Date(rem.sentAt), "h:mm a")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
