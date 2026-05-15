import { formatMoney } from "@/components/invoices/templates/types";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, MoreVertical, Filter } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function RecentSalesList({ invoices }: { invoices: any[] }) {
  return (
    <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col h-[300px]">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-slate-800 font-bold">
          <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-xs">📄</div>
          <span>Recent Invoices</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors">
            <Filter className="w-3.5 h-3.5" />
          </button>
          <div className="bg-slate-50 border border-slate-100 rounded-full px-4 py-1.5 text-xs font-semibold text-slate-600 flex items-center gap-1 cursor-pointer">
            Week <span className="text-[10px]">▼</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {invoices.length === 0 ? (
          <p className="text-sm text-slate-500 flex h-full items-center justify-center">No recent invoices.</p>
        ) : (
          invoices.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0 group">
              <div className="flex items-center gap-3 w-1/3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                  {inv.customerName.charAt(0).toUpperCase()}
                </div>
                <div className="truncate">
                  <p className="font-bold text-slate-800 text-sm truncate">{inv.customerName}</p>
                  <p className="text-[10px] font-semibold text-slate-400">
                    {formatDistanceToNow(new Date(inv.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>

              <div className="w-1/4 flex justify-center">
                <span className={cn(
                  "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  inv.status === 'paid' ? "bg-emerald-50 text-emerald-600" : 
                  inv.status === 'overdue' ? "bg-rose-50 text-rose-600" : 
                  "bg-amber-50 text-amber-600"
                )}>
                  {inv.status}
                </span>
              </div>

              <div className="w-1/4 text-right">
                <p className="font-bold text-slate-900 text-sm">{formatMoney(inv.amountCents)}</p>
              </div>

              <div className="w-12 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link href={`/invoices/${inv.id}`}>
                  <button className="w-8 h-8 rounded hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
