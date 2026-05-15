import { getInvoices } from "@/server/queries/invoices";
import { requireAuth } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { format } from "date-fns";

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const session = await requireAuth();
  const params = await searchParams;
  const query = params.q || "";
  const statusFilter = params.status || "all";

  let invoiceList: any[] = [];
  try {
    invoiceList = await getInvoices(session.userId, query, statusFilter);
  } catch (e) {
    console.error(e);
  }

  const formatMoney = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and track your invoices.</p>
        </div>
        <Link href="/invoices/new">
          <Button>Create Invoice</Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <form className="flex-1 w-full" action="/invoices" method="GET">
          {statusFilter !== "all" && <input type="hidden" name="status" value={statusFilter} />}
          <Input 
            name="q" 
            defaultValue={query} 
            placeholder="Search by customer or description..." 
            className="w-full sm:max-w-md bg-white"
          />
        </form>

        <form action="/invoices" method="GET" className="w-full sm:w-auto">
          {query && <input type="hidden" name="q" value={query} />}
          <Select name="status" defaultValue={statusFilter}>
            <SelectTrigger className="w-full sm:w-[180px] bg-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </form>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Customer</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    No invoices found.
                  </TableCell>
                </TableRow>
              ) : (
                invoiceList.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.customerName}</TableCell>
                    <TableCell className="text-slate-500">{invoice.description}</TableCell>
                    <TableCell>{formatMoney(invoice.amountCents)}</TableCell>
                    <TableCell>
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                        invoice.status === 'paid' ? "bg-emerald-50 text-emerald-700 border-emerald-200" : 
                        invoice.status === 'overdue' ? "bg-rose-50 text-rose-700 border-rose-200" : 
                        "bg-amber-50 text-amber-700 border-amber-200"
                      )}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {format(new Date(invoice.dueDate), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/invoices/${invoice.id}`} className="text-sm font-medium text-blue-600 hover:underline">
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
