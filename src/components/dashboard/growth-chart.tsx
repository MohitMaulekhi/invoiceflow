"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export function GrowthChart({ paidCount, totalCount }: { paidCount: number, totalCount: number }) {
  const percentage = totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 0;
  
  const data = [
    { name: 'Paid', value: percentage },
    { name: 'Unpaid', value: 100 - percentage },
  ];

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col h-75">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2 text-slate-800 font-bold">
          <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-xs">🚀</div>
          <span>Collection Rate</span>
        </div>
      </div>

      <div className="flex-1 w-full h-full relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
              cornerRadius={10}
            >
              <Cell fill="#4f46e5" /> 
              <Cell fill="#f1f5f9" /> 
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-black text-slate-900">+{percentage}%</span>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Collected</span>
        </div>
      </div>
    </div>
  );
}
