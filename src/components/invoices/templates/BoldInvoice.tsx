import React from "react";
import { format } from "date-fns";
import type { InvoiceTemplateProps } from "@/types/invoice";
import { formatMoney } from "./types";

export function BoldInvoice({ invoice, customer, lineItems, business }: InvoiceTemplateProps) {
  return (
    <div className="w-full h-full mx-auto bg-slate-50 font-sans shadow-lg overflow-hidden flex flex-col">
      <div className="bg-slate-900 text-white p-12 flex justify-between items-center">
        <div>
          <h2 className="text-5xl font-black uppercase tracking-tighter mb-2 text-primary">INVOICE</h2>
          <p className="text-xl font-bold opacity-80">#{invoice.invoiceNumber}</p>
        </div>
        <div className="text-right">
          {business.logoUrl ? (
            <img src={business.logoUrl} alt={business.name} className="h-16 ml-auto brightness-0 invert" />
          ) : (
            <h1 className="text-3xl font-black uppercase tracking-tight">{business.name}</h1>
          )}
        </div>
      </div>

      <div className="flex bg-white flex-1">
        {/* Main Content */}
        <div className="w-2/3 p-12 flex flex-col">
          <div className="mb-12">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Billed To</h3>
            <div className="text-slate-800 space-y-1">
              <p className="font-black text-lg">{customer.companyName || customer.name}</p>
              {customer.companyName && <p className="font-medium text-slate-600">{customer.name}</p>}
              {customer.addressLine1 && <p>{customer.addressLine1}</p>}
              {(customer.city || customer.state || customer.zip) && (
                <p>{[customer.city, customer.state, customer.zip].filter(Boolean).join(", ")}</p>
              )}
              {customer.country && <p>{customer.country}</p>}
              {customer.email && <p className="text-primary font-medium mt-2">{customer.email}</p>}
            </div>
          </div>

          <table className="w-full text-left text-sm mb-auto">
            <thead>
              <tr className="border-b-4 border-slate-900 text-slate-900">
                <th className="py-3 font-black uppercase tracking-wider">Item</th>
                <th className="py-3 text-right font-black uppercase tracking-wider">Qty</th>
                <th className="py-3 text-right font-black uppercase tracking-wider">Price</th>
                <th className="py-3 text-right font-black uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100">
              {lineItems.map((item) => (
                <tr key={item.id}>
                  <td className="py-4 font-bold text-slate-800">{item.description}</td>
                  <td className="py-4 text-right font-medium text-slate-500">{item.quantity}</td>
                  <td className="py-4 text-right font-medium text-slate-500">{formatMoney(item.unitPriceCents)}</td>
                  <td className="py-4 text-right font-black text-slate-900">{formatMoney(item.totalCents)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {(invoice.notes || invoice.terms) && (
            <div className="text-sm space-y-6 pt-6 border-t-2 border-slate-100">
              {invoice.notes && (
                <div>
                  <h4 className="font-black uppercase tracking-widest text-slate-900 mb-2">Notes</h4>
                  <p className="text-slate-600 font-medium leading-relaxed">{invoice.notes}</p>
                </div>
              )}
              {invoice.terms && (
                <div>
                  <h4 className="font-black uppercase tracking-widest text-slate-900 mb-2">Terms</h4>
                  <p className="text-slate-500 font-medium leading-relaxed">{invoice.terms}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-1/3 bg-slate-100 p-12 border-l border-slate-200 flex flex-col">
          <div className="space-y-8 mb-auto">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Issue Date</h3>
              <p className="font-black text-slate-900">{format(new Date(invoice.createdAt), "MMM dd, yyyy")}</p>
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Due Date</h3>
              <p className="font-black text-rose-600">{format(new Date(invoice.dueDate), "MMM dd, yyyy")}</p>
            </div>
            
            <div className="pt-8 border-t-2 border-slate-200">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">From</h3>
              <div className="text-sm font-medium text-slate-600 space-y-1">
                <p>{business.address}</p>
                <p>{business.email}</p>
                {business.phone && <p>{business.phone}</p>}
              </div>
            </div>
          </div>

          <div className="mt-12 space-y-4 text-sm font-medium text-slate-600">
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p className="font-black text-slate-900">{formatMoney(invoice.subtotalCents)}</p>
            </div>
            {invoice.discountCents > 0 && (
              <div className="flex justify-between">
                <p>Discount</p>
                <p className="font-black text-primary">-{formatMoney(invoice.discountCents)}</p>
              </div>
            )}
            {invoice.taxCents > 0 && (
              <div className="flex justify-between">
                <p>Tax</p>
                <p className="font-black text-slate-900">{formatMoney(invoice.taxCents)}</p>
              </div>
            )}
            <div className="flex justify-between items-end pt-6 border-t-4 border-slate-900 mt-4">
              <p className="font-black uppercase tracking-widest text-slate-900">Total</p>
              <p className="font-black text-2xl text-slate-900">{formatMoney(invoice.amountCents)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
