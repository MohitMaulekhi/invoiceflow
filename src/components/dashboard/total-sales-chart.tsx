"use client";

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { formatMoney } from "@/components/invoices/templates/utils";
import { BarChartDataPoint } from "@/types/invoice";

export function TotalSalesChart({ data }: { data: BarChartDataPoint[], total: number }) {
  // Find max value to color it differently
  const maxValue = Math.max(...data.map(d => d.total));

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col h-full min-h-75">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-slate-800 font-bold">
          <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-xs font-serif">₹</div>
          <span>Total Sales</span>
        </div>
      </div>

      <div className="flex-1 w-full h-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }}
              dy={10}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-800 text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-lg">
                      {formatMoney(payload[0].value as number * 100)}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="total" radius={[8, 8, 8, 8]} barSize={32}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.total === maxValue && entry.total > 0 ? "#f97316" : "#f1f5f9"} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
