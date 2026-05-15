"use client";

import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Download, Send, CheckCircle } from "lucide-react";
import { 
  MinimalInvoice, 
  ModernInvoice, 
  ClassicInvoice, 
  BoldInvoice, 
  ElegantInvoice,
  InvoiceData,
  CustomerData,
  LineItemData
} from "@/components/invoices/templates";
import { markAsPaidAction } from "@/server/actions/invoices/mark-paid";
import { sendReminderAction } from "@/server/actions/reminders/send-reminder";
import { useTransition } from "react";

interface InvoiceViewerProps {
  invoice: InvoiceData & { id: string; status: string; templateId: string };
  customer: CustomerData;
  lineItems: LineItemData[];
  userProfile: any;
}

export function InvoiceViewer({ invoice, customer, lineItems, userProfile }: InvoiceViewerProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();

  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: `Invoice_${invoice.invoiceNumber}`,
  });

  const isPaid = invoice.status === "paid";

  const renderTemplate = () => {
    const businessData = {
      name: userProfile?.businessName || userProfile?.name || "Your Business Name",
      email: userProfile?.email || "",
      address: userProfile?.businessAddress || "No address provided",
      phone: userProfile?.businessPhone || "",
    };

    const props = { invoice, customer, lineItems, business: businessData };
    switch (invoice.templateId) {
      case "modern": return <ModernInvoice {...props} />;
      case "classic": return <ClassicInvoice {...props} />;
      case "bold": return <BoldInvoice {...props} />;
      case "elegant": return <ElegantInvoice {...props} />;
      case "minimal": 
      default: return <MinimalInvoice {...props} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex gap-3">
          {!isPaid && (
            <form action={() => startTransition(() => sendReminderAction(invoice.id))}>
              <Button variant="outline" type="submit" className="gap-2 text-primary border-primary/20 hover:bg-primary/5" disabled={isPending}>
                <Send className="w-4 h-4" /> Send Reminder
              </Button>
            </form>
          )}
          {!isPaid && (
            <form action={() => startTransition(() => markAsPaidAction(invoice.id))}>
              <Button type="submit" className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white" disabled={isPending}>
                <CheckCircle className="w-4 h-4" /> Mark as Paid
              </Button>
            </form>
          )}
        </div>
        <Button onClick={() => handlePrint()} className="gap-2" variant="secondary">
          <Download className="w-4 h-4" /> Download PDF
        </Button>
      </div>

      {/* Invoice Paper Preview */}
      <div className="bg-slate-200/50 p-4 md:p-8 rounded-2xl flex justify-center overflow-x-auto border border-slate-200">
        <div className="w-full max-w-[800px] shadow-2xl bg-white relative">
          <div ref={contentRef} className="w-full h-full bg-white print:m-0 print:p-0">
            {/* Wrapper for print specific styles */}
            <div className="print:block">
              {renderTemplate()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
