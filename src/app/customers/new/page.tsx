"use client";

import { useActionState } from "react";
import { createCustomerAction } from "@/server/actions/invoices/create-customer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewCustomerPage() {
  const [state, formAction, isPending] = useActionState(createCustomerAction, null);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/customers" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to customers
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Add Customer</h1>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg">Customer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-widest border-b pb-2">Basic Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-slate-700">
                    Primary Contact Name *
                  </label>
                  <Input id="name" name="name" placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="companyName" className="text-sm font-medium text-slate-700">
                    Company Name
                  </label>
                  <Input id="companyName" name="companyName" placeholder="Acme Corp" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Email Address
                  </label>
                  <Input id="email" name="email" type="email" placeholder="billing@acme.com" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-slate-700">
                    Phone Number
                  </label>
                  <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="taxId" className="text-sm font-medium text-slate-700">
                    Tax ID / VAT
                  </label>
                  <Input id="taxId" name="taxId" placeholder="e.g. GB123456789" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-widest border-b pb-2">Billing Address</h3>
              <div className="space-y-2">
                <label htmlFor="addressLine1" className="text-sm font-medium text-slate-700">
                  Street Address
                </label>
                <Input id="addressLine1" name="addressLine1" placeholder="123 Business Rd" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <label htmlFor="city" className="text-sm font-medium text-slate-700">
                    City
                  </label>
                  <Input id="city" name="city" placeholder="San Francisco" />
                </div>
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <label htmlFor="state" className="text-sm font-medium text-slate-700">
                    State / Region
                  </label>
                  <Input id="state" name="state" placeholder="CA" />
                </div>
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <label htmlFor="zip" className="text-sm font-medium text-slate-700">
                    ZIP / Postal Code
                  </label>
                  <Input id="zip" name="zip" placeholder="94016" />
                </div>
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <label htmlFor="country" className="text-sm font-medium text-slate-700">
                    Country
                  </label>
                  <Input id="country" name="country" placeholder="United States" />
                </div>
              </div>
            </div>

            {state?.error && (
              <p className="text-sm text-red-600">{state.error}</p>
            )}

            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={isPending} className="px-8 shadow-md">
                {isPending ? "Saving..." : "Save Customer"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
