import { formatMoney } from "@/components/invoices/templates/types";

export function TopItemsList({ items, totalSalesCents }: { items: any[], totalSalesCents: number }) {
  return (
    <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col h-[300px]">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-slate-800 font-bold">
          <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-xs">📦</div>
          <span>Top Item Sales</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {items.length === 0 ? (
          <p className="text-sm text-slate-500 flex h-full items-center justify-center">No sales data yet.</p>
        ) : (
          items.map((item, idx) => {
            const percentage = totalSalesCents > 0 ? Math.round((item.totalCents / totalSalesCents) * 100) : 0;
            return (
              <div key={idx} className="flex items-center justify-between group">
                <div className="w-1/3">
                  <p className="font-bold text-slate-800 text-sm truncate">{item.name}</p>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Service</p>
                </div>
                
                <div className="flex-1 mx-4 flex items-center">
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className="bg-indigo-500 h-2 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    />
                  </div>
                </div>

                <div className="w-1/4 text-right">
                  <p className="font-bold text-slate-900 text-sm">{formatMoney(item.totalCents)}</p>
                  <p className="text-[10px] font-bold text-emerald-500 flex items-center justify-end gap-0.5">
                    <span className="text-[8px]">▲</span> {percentage}%
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
