"use client";

import React, { useRef, useTransition } from "react";
import { toJpeg } from "html-to-image";
import jsPDF from "jspdf";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Download, Send, CheckCircle, Edit2, MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
import { deleteInvoiceAction } from "@/server/actions/invoices/delete-invoice";
import Link from "next/link";
import { ALLOWED_STATUS_TRANSITIONS, InvoiceStatus } from "@/lib/invoice-states";
import { updateInvoiceStatusAction } from "@/server/actions/invoices/update-invoice-status";

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

  const isPaid = invoice.status === "paid" || invoice.status === "voided";

  const handleUpdateStatus = (status: any) => {
    startTransition(async () => {
      await updateInvoiceStatusAction(invoice.id, status);
    });
  };

  const handleSendReminder = async () => {
    startTransition(async () => {
      try {
        let pdfBase64 = "";
        if (contentRef.current) {
          const imgData = await toJpeg(contentRef.current, { pixelRatio: 2, quality: 1.0 });
          const pdf = new jsPDF({
            orientation: "portrait",
            unit: "px",
            format: [800, 1131]
          });
          pdf.addImage(imgData, "JPEG", 0, 0, 800, 1131);
          pdfBase64 = pdf.output("datauristring");
        }
        await sendReminderAction(invoice.id, pdfBase64);
        alert("Reminder sent successfully!");
      } catch (error: any) {
        alert(error.message);
      }
    });
  };

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

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this invoice? This action cannot be undone.")) {
      startTransition(async () => {
        await deleteInvoiceAction(invoice.id);
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white p-4 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        <div className="flex flex-wrap justify-center lg:justify-start gap-3 w-full lg:w-auto">
          {invoice.status === "draft" && (
            <form action={() => handleUpdateStatus('sent')}>
              <Button type="submit" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20" disabled={isPending}>
                <Send className="w-4 h-4" /> Mark as Sent
              </Button>
            </form>
          )}
          {!isPaid && invoice.status !== "draft" && (
            <form action={() => handleUpdateStatus('paid')}>
              <Button type="submit" className="gap-2 bg-[#059669] hover:bg-[#047857] text-white rounded-xl font-bold shadow-lg shadow-emerald-600/20" disabled={isPending}>
                <CheckCircle className="w-4 h-4" /> Mark as Paid
              </Button>
            </form>
          )}
          <form action={() => handleSendReminder()}>
            <Button variant="outline" type="submit" className="gap-2 text-primary border-primary/20 hover:bg-primary/5 rounded-xl font-semibold shadow-sm" disabled={isPending}>
              <Send className="w-4 h-4" /> Send Reminder
            </Button>
          </form>
        </div>
        <div className="flex flex-wrap justify-center lg:justify-end items-center gap-2 w-full lg:w-auto">
          <Button onClick={() => handlePrint()} className="gap-2 rounded-xl font-semibold" variant="secondary">
            <Download className="w-4 h-4" /> Download PDF
          </Button>
          <Link href={`/invoices/${invoice.id}/edit`}>
            <Button variant="outline" className="gap-2 rounded-xl font-semibold">
              <Edit2 className="w-4 h-4" /> Edit
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl text-slate-400 hover:text-slate-900">
                <MoreVertical className="w-4 h-4" />
              </Button>
            } />
            <DropdownMenuContent align="end" className="w-48 rounded-[16px] p-2">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer font-medium py-2.5 rounded-xl">
                  <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" /> Change Status
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="w-40 rounded-[16px] p-2">
                    {(ALLOWED_STATUS_TRANSITIONS[invoice.status as InvoiceStatus] || []).map((s) => (
                      <DropdownMenuItem 
                        key={s} 
                        className="cursor-pointer font-medium py-2 rounded-xl capitalize" 
                        onClick={() => handleUpdateStatus(s)}
                      >
                        {s.replace("_", " ")}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem onClick={handleDelete} className="cursor-pointer text-rose-600 focus:text-rose-700 focus:bg-rose-50 font-medium py-2.5 rounded-xl">
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Invoice Paper Preview */}
      <div className="bg-[#F0F4F8] p-4 sm:p-8 md:p-12 rounded-[32px] overflow-x-auto border border-slate-200 shadow-inner">
        <div className="min-w-[800px] w-[800px] aspect-[1/1.414] shadow-[0_20px_60px_rgb(0,0,0,0.1)] bg-white mx-0 lg:mx-auto print:m-0 print:p-0">
          <div ref={contentRef} className="w-full h-full bg-white">
            {/* Wrapper for print specific styles */}
            <div className="print:block w-full h-full">
              {renderTemplate()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
