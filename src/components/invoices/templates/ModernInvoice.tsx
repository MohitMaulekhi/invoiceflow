import React from "react";
import { format } from "date-fns";
import type { InvoiceTemplateProps } from "@/types/invoice";
import { formatMoney } from "./types";

export function ModernInvoice({ invoice, customer, lineItems, business }: InvoiceTemplateProps) {
  return (
    <div className="w-full h-full mx-auto bg-white shadow-sm overflow-hidden font-sans flex flex-col">
      <div className="bg-primary text-primary-foreground p-12 flex justify-between items-center">
        <div>
          {business.logoUrl ? (
            <img src={business.logoUrl} alt={business.name} className="h-12 brightness-0 invert" />
          ) : (
            <h1 className="text-3xl font-bold tracking-tight">{business.name}</h1>
          )}
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-semibold opacity-90 uppercase tracking-widest mb-1">Invoice</h2>
          <p className="text-primary-foreground/80">#{invoice.invoiceNumber}</p>
        </div>
      </div>

      <div className="p-12 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-12">
          <div className="space-y-1 text-sm text-slate-600">
            <p className="font-semibold text-slate-900 mb-2">From:</p>
            <p className="font-medium text-slate-800">{business.name}</p>
            <p>{business.address}</p>
            <p>{business.email}</p>
            {business.phone && <p>{business.phone}</p>}
          </div>
          
          <div className="space-y-1 text-sm text-slate-600 text-right">
            <p className="font-semibold text-slate-900 mb-2">Billed To:</p>
            <p className="font-bold text-slate-800">{customer.companyName || customer.name}</p>
            {customer.companyName && <p>{customer.name}</p>}
            {customer.addressLine1 && <p>{customer.addressLine1}</p>}
            {(customer.city || customer.state || customer.zip) && (
              <p>{[customer.city, customer.state, customer.zip].filter(Boolean).join(", ")}</p>
            )}
            {customer.country && <p>{customer.country}</p>}
            {customer.email && <p>{customer.email}</p>}
          </div>
        </div>

        <div className="flex gap-12 mb-12 p-6 bg-slate-50 rounded-xl border border-slate-100">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Issue Date</p>
            <p className="font-semibold text-slate-800">{format(new Date(invoice.createdAt), "MMM dd, yyyy")}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Due Date</p>
            <p className="font-semibold text-slate-800">{format(new Date(invoice.dueDate), "MMM dd, yyyy")}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-primary uppercase tracking-wider mb-1 font-semibold">Amount Due</p>
            <p className="font-bold text-2xl text-primary">{formatMoney(invoice.amountCents)}</p>
          </div>
        </div>

        <table className="w-full text-left text-sm mb-12">
          <thead>
            <tr className="border-b-2 border-primary/20 text-slate-700">
              <th className="py-3 font-semibold">Item Description</th>
              <th className="py-3 text-right font-semibold">Qty</th>
              <th className="py-3 text-right font-semibold">Price</th>
              <th className="py-3 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {lineItems.map((item) => (
              <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="py-4 font-medium text-slate-800">{item.description}</td>
                <td className="py-4 text-right text-slate-600">{item.quantity}</td>
                <td className="py-4 text-right text-slate-600">{formatMoney(item.unitPriceCents)}</td>
                <td className="py-4 text-right font-semibold text-slate-900">{formatMoney(item.totalCents)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-auto">
          <div className="w-72 space-y-3 p-6 bg-slate-50 rounded-xl border border-slate-100 text-sm">
            <div className="flex justify-between text-slate-600">
              <p>Subtotal</p>
              <p className="font-medium text-slate-900">{formatMoney(invoice.subtotalCents)}</p>
            </div>
            {invoice.discountCents > 0 && (
              <div className="flex justify-between text-primary">
                <p>Discount</p>
                <p>-{formatMoney(invoice.discountCents)}</p>
              </div>
            )}
            {invoice.taxCents > 0 && (
              <div className="flex justify-between text-slate-600">
                <p>Tax</p>
                <p className="font-medium text-slate-900">{formatMoney(invoice.taxCents)}</p>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t-2 border-primary/20 pt-3 text-primary">
              <p>Total</p>
              <p>{formatMoney(invoice.amountCents)}</p>
            </div>
          </div>
        </div>

        {(invoice.notes || invoice.terms) && (
          <div className="text-sm space-y-4">
            {invoice.notes && (
              <div className="p-4 bg-slate-50 rounded-lg text-slate-600 border-l-4 border-primary">
                <p className="font-semibold text-slate-800 mb-1">Notes</p>
                <p>{invoice.notes}</p>
              </div>
            )}
            {invoice.terms && (
              <div className="text-slate-500">
                <p className="font-semibold text-slate-700 mb-1">Terms & Conditions</p>
                <p>{invoice.terms}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
