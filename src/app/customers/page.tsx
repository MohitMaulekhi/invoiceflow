import { getCustomers } from "@/server/queries/customers";
import { requireAuth } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default async function CustomersPage() {
  const session = await requireAuth();
  
  let customerList: any[] = [];
  try {
    customerList = await getCustomers(session.userId);
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
          <p className="text-sm text-slate-500 mt-1">Manage people and businesses who owe you money.</p>
        </div>
        <Link href="/customers/new">
          <Button>Add Customer</Button>
        </Link>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customerList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-slate-500">
                    No customers found. Add your first customer to get started.
                  </TableCell>
                </TableRow>
              ) : (
                customerList.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell className="text-right text-slate-500">
                      {new Date(customer.createdAt).toLocaleDateString()}
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
