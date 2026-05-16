"use client";

import { useState, useTransition, useMemo, useOptimistic } from "react";
import { deleteInvoiceAction } from "@/server/actions/invoices/delete-invoice";
import { updateInvoiceStatusAction } from "@/server/actions/invoices/update-invoice-status";
import { sendReminderAction } from "@/server/actions/reminders/send-reminder";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Search, MoreVertical, Edit2, Trash2, Send, CheckCircle, Clock, ExternalLink } from "lucide-react";
import { formatMoney } from "@/components/invoices/templates/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ALLOWED_STATUS_TRANSITIONS } from "@/lib/invoice-states";
import type { InvoiceStatus } from "@/types/invoice";

export function InvoiceList({ initialInvoices }: { initialInvoices: any[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isPending, startTransition] = useTransition();

  const [optimisticInvoices, setOptimisticInvoices] = useOptimistic(
    initialInvoices,
    (state, { id, status }: { id: string; status: string }) =>
      state.map((inv) => (inv.id === id ? { ...inv, status } : inv))
  );

  const filteredInvoices = useMemo(() => {
    return optimisticInvoices.filter(inv => {
      const matchesSearch = inv.customerName.toLowerCase().includes(search.toLowerCase()) || 
                            inv.description.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [initialInvoices, search, statusFilter]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      startTransition(async () => {
        await deleteInvoiceAction(id);
      });
    }
  };

  const handleUpdateStatus = (id: string, status: any) => {
    startTransition(async () => {
      setOptimisticInvoices({ id, status });
      await updateInvoiceStatusAction(id, status);
    });
  };

  const handleSendReminder = (id: string) => {
    startTransition(async () => {
      try {
        await sendReminderAction(id);
        alert("Reminder sent successfully!");
      } catch (error: any) {
        alert(error.message);
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-[24px] shadow-sm border border-slate-100">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer or description..." 
            className="pl-12 bg-slate-50 border-transparent focus:border-primary focus:bg-white rounded-xl h-12 text-base"
          />
        </div>
        <div className="w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "all")}>
            <SelectTrigger className="w-full sm:w-[180px] h-12 rounded-xl bg-slate-50 border-transparent focus:border-primary focus:bg-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="viewed">Viewed</SelectItem>
              <SelectItem value="partially_paid">Partially Paid</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="voided">Voided</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-4">
        {filteredInvoices.map(invoice => (
          <div 
            key={invoice.id}
            className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            {/* Left: Customer Info */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
                  {invoice.customerName.charAt(0).toUpperCase()}
                </div>
                <div className="truncate">
                  <h3 className="font-bold text-lg text-slate-900 leading-tight truncate">{invoice.customerName}</h3>
                  <p className="text-sm text-slate-500 font-medium truncate">{invoice.description}</p>
                </div>
              </div>

              {/* Middle: Status and Dates */}
              <div className="flex flex-col sm:items-end sm:justify-center w-full sm:w-auto shrink-0 gap-1.5">
                <span className={cn(
                  "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                  invoice.status === 'paid' ? "bg-emerald-50 text-emerald-600" : 
                  invoice.status === 'overdue' ? "bg-rose-50 text-rose-600" : 
                  invoice.status === 'voided' ? "bg-slate-100 text-slate-600" :
                  "bg-amber-50 text-amber-600"
                )}>
                  {invoice.status.replace("_", " ")}
                </span>
                <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Due {format(new Date(invoice.dueDate), "MMM d, yyyy")}
                </div>
              </div>

              {/* Right: Amount & Actions */}
              <div className="flex items-center justify-between w-full sm:w-auto shrink-0 gap-6">
                <div className="text-right">
                  <p className="text-xl font-bold text-slate-900">{formatMoney(invoice.amountCents)}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/invoices/${invoice.id}`}>
                    <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full text-primary bg-primary/5 hover:bg-primary/10 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger render={
                      <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full text-slate-400 hover:text-slate-900 transition-colors">
                        <MoreVertical className="w-5 h-5" />
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
                                onClick={() => handleUpdateStatus(invoice.id, s)}
                              >
                                {s.replace("_", " ")}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuItem className="cursor-pointer font-medium py-2.5 rounded-xl" onClick={() => handleSendReminder(invoice.id)}>
                        <Send className="w-4 h-4 mr-2 text-primary" /> Send Reminder
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="my-1" />
                      <Link href={`/invoices/${invoice.id}/edit`}>
                        <DropdownMenuItem className="cursor-pointer font-medium py-2.5 rounded-xl">
                          <Edit2 className="w-4 h-4 mr-2 text-slate-500" /> Edit Invoice
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem onClick={() => handleDelete(invoice.id)} className="cursor-pointer text-rose-600 focus:text-rose-700 focus:bg-rose-50 font-medium py-2.5 rounded-xl mt-1">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
      </div>

      {filteredInvoices.length === 0 && (
        <div className="text-center py-24 bg-white rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <p className="text-slate-500 font-medium text-lg">No invoices found.</p>
          <p className="text-slate-400 mt-2">Try adjusting your search or filter.</p>
        </div>
      )}
    </div>
  );
}
