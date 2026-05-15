"use client";

import { LineChart, Line, ResponsiveContainer, Area, AreaChart } from "recharts";
import { formatMoney } from "@/components/invoices/templates/types";
import { MoreVertical } from "lucide-react";

export function SalesRevenueChart({ paidAmount, unpaidAmount, receivedData, orderedData }: { paidAmount: number, unpaidAmount: number, receivedData: any[], orderedData: any[] }) {

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 h-full min-h-[300px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-slate-800 font-bold">
          <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-xs">📈</div>
          <span>Sales Revenue</span>
        </div>
        <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1">
        {/* Received Amount Sparkline */}
        <div className="flex flex-col h-full">
          <p className="text-emerald-500 text-[10px] font-bold mb-1 flex items-center gap-1">
            ↗ 24% for 1 day
          </p>
          <p className="text-2xl font-black text-slate-900 tracking-tight">{formatMoney(paidAmount)}</p>
          <div className="flex items-center gap-1 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Received Amount</span>
          </div>
          <div className="flex-1 w-full min-h-[60px] relative overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={receivedData}>
                <defs>
                  <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorReceived)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ordered Amount Sparkline */}
        <div className="flex flex-col h-full border-l border-slate-100 pl-4">
          <p className="text-rose-500 text-[10px] font-bold mb-1 flex items-center gap-1">
            ↘ 8%
          </p>
          <p className="text-2xl font-black text-slate-900 tracking-tight">{formatMoney(unpaidAmount)}</p>
          <div className="flex items-center gap-1 mb-2">
            <div className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Pending Amount</span>
          </div>
          <div className="flex-1 w-full min-h-[60px] relative overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={orderedData}>
                <defs>
                  <linearGradient id="colorOrdered" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorOrdered)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
