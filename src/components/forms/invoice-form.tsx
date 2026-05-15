"use client";

import { useActionState } from "react";
import { createInvoiceAction } from "@/server/actions/invoices/create-invoice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function InvoiceForm({ customers }: { customers: any[] }) {
  const [state, formAction, isPending] = useActionState(createInvoiceAction, null);

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg">Invoice Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="customerId" className="text-sm font-medium text-slate-700">
              Customer
            </label>
            <Select name="customerId" required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name} {customer.email ? `(${customer.email})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-slate-700">
              Description
            </label>
            <Input id="description" name="description" placeholder="Website Design Services" required />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium text-slate-700">
                Amount (USD)
              </label>
              <Input id="amount" name="amount" type="number" step="0.01" min="0" placeholder="1500.00" required />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="dueDate" className="text-sm font-medium text-slate-700">
                Due Date
              </label>
              <Input id="dueDate" name="dueDate" type="date" required />
            </div>
          </div>

          {state?.error && (
            <p className="text-sm text-red-600">{state.error}</p>
          )}

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Invoice"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
