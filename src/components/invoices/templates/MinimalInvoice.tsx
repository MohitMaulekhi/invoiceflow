import React from "react";
import { format } from "date-fns";
import { InvoiceTemplateProps, formatMoney } from "./types";

export function MinimalInvoice({ invoice, customer, lineItems, business }: InvoiceTemplateProps) {
  return (
    <div className="w-full h-full mx-auto bg-white p-12 text-slate-800 font-sans flex flex-col">
      <div className="flex justify-between items-end mb-16">
        <div>
          {business.logoUrl ? (
            <img src={business.logoUrl} alt={business.name} className="h-12 mb-4" />
          ) : (
            <h1 className="text-2xl font-bold tracking-tight mb-4">{business.name}</h1>
          )}
          <div className="text-sm text-slate-500 space-y-1">
            <p>{business.address}</p>
            <p>{business.email}</p>
            {business.phone && <p>{business.phone}</p>}
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-4xl font-light text-slate-300 mb-2">INVOICE</h2>
          <p className="text-sm font-medium">#{invoice.invoiceNumber}</p>
        </div>
      </div>

      <div className="flex justify-between mb-12">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Billed To</p>
          <div className="text-sm space-y-1">
            <p className="font-semibold text-slate-800">{customer.companyName || customer.name}</p>
            {customer.companyName && <p className="text-slate-600">{customer.name}</p>}
            {customer.addressLine1 && <p>{customer.addressLine1}</p>}
            {(customer.city || customer.state || customer.zip) && (
              <p>{[customer.city, customer.state, customer.zip].filter(Boolean).join(", ")}</p>
            )}
            {customer.country && <p>{customer.country}</p>}
            {customer.email && <p>{customer.email}</p>}
          </div>
        </div>
        <div className="text-right text-sm space-y-2">
          <div className="flex justify-end gap-8">
            <p className="text-slate-500">Date Issued:</p>
            <p className="font-medium">{format(new Date(invoice.createdAt), "MMM dd, yyyy")}</p>
          </div>
          <div className="flex justify-end gap-8">
            <p className="text-slate-500">Date Due:</p>
            <p className="font-medium">{format(new Date(invoice.dueDate), "MMM dd, yyyy")}</p>
          </div>
          <div className="flex justify-end gap-8 pt-2">
            <p className="text-slate-500 font-semibold">Amount Due:</p>
            <p className="font-bold text-lg">{formatMoney(invoice.amountCents)}</p>
          </div>
        </div>
      </div>

      <table className="w-full text-left text-sm mb-12">
        <thead className="border-b-2 border-slate-100">
          <tr>
            <th className="py-3 font-semibold text-slate-600">Description</th>
            <th className="py-3 text-right font-semibold text-slate-600">Qty</th>
            <th className="py-3 text-right font-semibold text-slate-600">Price</th>
            <th className="py-3 text-right font-semibold text-slate-600">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y border-b border-slate-100 divide-slate-50">
          {lineItems.map((item) => (
            <tr key={item.id}>
              <td className="py-4">{item.description}</td>
              <td className="py-4 text-right text-slate-600">{item.quantity}</td>
              <td className="py-4 text-right text-slate-600">{formatMoney(item.unitPriceCents)}</td>
              <td className="py-4 text-right font-medium">{formatMoney(item.totalCents)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mb-auto">
        <div className="w-64 space-y-3 text-sm">
          <div className="flex justify-between text-slate-500">
            <p>Subtotal</p>
            <p>{formatMoney(invoice.subtotalCents)}</p>
          </div>
          {invoice.discountCents > 0 && (
            <div className="flex justify-between text-slate-500">
              <p>Discount</p>
              <p>-{formatMoney(invoice.discountCents)}</p>
            </div>
          )}
          {invoice.taxCents > 0 && (
            <div className="flex justify-between text-slate-500">
              <p>Tax</p>
              <p>{formatMoney(invoice.taxCents)}</p>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg border-t-2 border-slate-100 pt-3">
            <p>Total</p>
            <p>{formatMoney(invoice.amountCents)}</p>
          </div>
        </div>
      </div>

      {(invoice.notes || invoice.terms) && (
        <div className="text-sm text-slate-500 space-y-4 border-t border-slate-100 pt-8">
          {invoice.notes && (
            <div>
              <p className="font-semibold text-slate-700 mb-1">Notes</p>
              <p>{invoice.notes}</p>
            </div>
          )}
          {invoice.terms && (
            <div>
              <p className="font-semibold text-slate-700 mb-1">Terms</p>
              <p>{invoice.terms}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
