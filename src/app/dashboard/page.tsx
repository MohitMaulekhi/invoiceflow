import { getDashboardData } from "@/server/queries/dashboard";
import { requireAuth } from "@/lib/auth/session";
import { AIAssistantCard } from "@/components/dashboard/ai-assistant-card";
import { TotalSalesChart } from "@/components/dashboard/total-sales-chart";
import { SalesRevenueChart } from "@/components/dashboard/sales-revenue-chart";
import { RecentSalesList } from "@/components/dashboard/recent-sales-list";
import { GrowthChart } from "@/components/dashboard/growth-chart";
import { TopItemsList } from "@/components/dashboard/top-items-list";
import { Filter, Maximize } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await requireAuth();
  
  let data = null;
  try {
    data = await getDashboardData(session.userId);
  } catch (error) {
    console.error("Failed to fetch stats", error);
  }

  if (!data) return <div className="text-center py-20 text-slate-500">Failed to load dashboard data. Check database connection.</div>;

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-12">
      {/* Top Header Match Dribbble */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Your Sales Analysis</h1>
        
        <div className="flex items-center gap-3">
          <Link href="/invoices/new">
            <Button className="rounded-full bg-[#5D5FEF] hover:bg-[#4b4dcf] text-white font-bold shadow-lg shadow-[#5D5FEF]/20 h-10 px-6">
              + Add Invoice
            </Button>
          </Link>
          <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors">
            <span className="font-serif italic font-bold">◐</span>
          </button>
          <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors">
            <Maximize className="w-4 h-4" />
          </button>
          <button className="h-10 rounded-full bg-white border border-slate-200 flex items-center px-4 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors gap-2 shadow-sm">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Top Row */}
        <div className="xl:col-span-1 h-full">
          <AIAssistantCard />
        </div>
        <div className="xl:col-span-1 h-full">
          <TotalSalesChart data={data.weeklySales} total={data.totalAmount} />
        </div>
        <div className="xl:col-span-1 h-full">
          <SalesRevenueChart 
            paidAmount={data.stats.paidAmount} 
            unpaidAmount={data.stats.unpaidAmount + data.stats.overdueAmount} 
            receivedData={data.receivedData}
            orderedData={data.orderedData}
          />
        </div>

        {/* Bottom Row */}
        <div className="xl:col-span-1 h-full">
          <RecentSalesList invoices={data.recentSalesList} />
        </div>
        <div className="xl:col-span-1 h-full">
          <GrowthChart paidCount={data.stats.paidAmount} totalCount={data.totalAmount} />
        </div>
        <div className="xl:col-span-1 h-full">
          <TopItemsList items={data.topItems} totalSalesCents={data.totalAmount} />
        </div>

      </div>
    </div>
  );
}
