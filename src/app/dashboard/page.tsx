import { getDashboardStats } from "@/server/queries/dashboard";
import { requireAuth } from "@/lib/auth/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Clock, CheckCircle2, DollarSign } from "lucide-react";

export default async function DashboardPage() {
  const session = await requireAuth();
  
  let stats = { totalCount: 0, paidAmount: 0, unpaidAmount: 0, overdueAmount: 0, overdueCount: 0, pendingCount: 0 };
  
  try {
    stats = await getDashboardStats(session.userId);
  } catch (error) {
    console.error("Failed to fetch stats", error);
  }

  const formatMoney = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Overview</h1>
        <p className="text-slate-500 mt-2">Manage your business metrics and outstanding invoices.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-slate-200 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Outstanding</CardTitle>
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMoney(stats.unpaidAmount + stats.overdueAmount)}</div>
            <p className="text-xs text-slate-500 mt-1">From {stats.pendingCount + stats.overdueCount} invoices</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-slate-200 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Amount Overdue</CardTitle>
            <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center">
              <Clock className="h-4 w-4 text-rose-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">{formatMoney(stats.overdueAmount)}</div>
            <p className="text-xs text-slate-500 mt-1">{stats.overdueCount} overdue invoices</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Collected</CardTitle>
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMoney(stats.paidAmount)}</div>
            <p className="text-xs text-slate-500 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Invoices</CardTitle>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <ArrowUpRight className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCount}</div>
            <p className="text-xs text-slate-500 mt-1">Total created</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
