import React from "react";
import { format } from "date-fns";
import type { InvoiceTemplateProps } from "@/types/invoice";
import { formatMoney } from "./types";

export function ElegantInvoice({ invoice, customer, lineItems, business }: InvoiceTemplateProps) {
  return (
    <div className="w-full h-full mx-auto bg-[#faf9f6] p-16 font-serif text-slate-800 shadow-sm border border-stone-200 flex flex-col">
      <div className="text-center mb-16 space-y-6">
        {business.logoUrl ? (
          <img src={business.logoUrl} alt={business.name} className="h-16 mx-auto" />
        ) : (
          <h1 className="text-4xl font-normal tracking-widest uppercase text-stone-800">{business.name}</h1>
        )}
        <div className="w-16 h-px bg-stone-300 mx-auto"></div>
        <div className="text-sm tracking-widest text-stone-500 uppercase space-y-1">
          <p>{business.address}</p>
          <p>{business.email}</p>
        </div>
      </div>

      <div className="flex justify-between items-end mb-16 border-b border-stone-300 pb-8">
        <div>
          <h2 className="text-xs uppercase tracking-widest text-stone-400 mb-4">Invoice To</h2>
          <div className="space-y-1 text-stone-700">
            <p className="text-xl font-medium text-stone-900">{customer.companyName || customer.name}</p>
            {customer.companyName && <p className="italic text-stone-500">{customer.name}</p>}
            {customer.addressLine1 && <p>{customer.addressLine1}</p>}
            {(customer.city || customer.state || customer.zip) && (
              <p>{[customer.city, customer.state, customer.zip].filter(Boolean).join(", ")}</p>
            )}
            {customer.country && <p>{customer.country}</p>}
          </div>
        </div>
        <div className="text-right space-y-2">
          <h2 className="text-3xl font-light tracking-widest uppercase text-stone-800 mb-6">Invoice</h2>
          <div className="text-sm text-stone-500 tracking-wider">
            <p><span className="w-24 inline-block text-stone-400">Number</span> <span className="font-medium text-stone-800">#{invoice.invoiceNumber}</span></p>
            <p><span className="w-24 inline-block text-stone-400">Date</span> <span className="font-medium text-stone-800">{format(new Date(invoice.createdAt), "MMM dd, yyyy")}</span></p>
            <p><span className="w-24 inline-block text-stone-400">Due</span> <span className="font-medium text-stone-800">{format(new Date(invoice.dueDate), "MMM dd, yyyy")}</span></p>
          </div>
        </div>
      </div>

      <table className="w-full text-left text-sm mb-16">
        <thead>
          <tr className="border-b border-stone-300 text-stone-400 uppercase tracking-widest text-xs">
            <th className="py-4 font-normal">Service</th>
            <th className="py-4 text-center font-normal">Qty</th>
            <th className="py-4 text-right font-normal">Rate</th>
            <th className="py-4 text-right font-normal">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-200">
          {lineItems.map((item) => (
            <tr key={item.id} className="text-stone-700">
              <td className="py-6 pr-4">
                <p className="font-medium text-stone-900">{item.description}</p>
              </td>
              <td className="py-6 text-center">{item.quantity}</td>
              <td className="py-6 text-right">{formatMoney(item.unitPriceCents)}</td>
              <td className="py-6 text-right font-medium text-stone-900">{formatMoney(item.totalCents)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mb-auto">
        <div className="w-72 space-y-4">
          <div className="flex justify-between text-stone-500 text-sm tracking-wider">
            <p>Subtotal</p>
            <p className="font-medium text-stone-800">{formatMoney(invoice.subtotalCents)}</p>
          </div>
          {invoice.discountCents > 0 && (
            <div className="flex justify-between text-sm tracking-wider">
              <p className="text-stone-500">Discount</p>
              <p className="text-stone-800">-{formatMoney(invoice.discountCents)}</p>
            </div>
          )}
          {invoice.taxCents > 0 && (
            <div className="flex justify-between text-stone-500 text-sm tracking-wider">
              <p>Tax</p>
              <p className="font-medium text-stone-800">{formatMoney(invoice.taxCents)}</p>
            </div>
          )}
          <div className="flex justify-between items-end border-t border-stone-300 pt-4 mt-4">
            <p className="text-sm uppercase tracking-widest text-stone-500 font-medium">Total Due</p>
            <p className="text-2xl font-light text-stone-900">{formatMoney(invoice.amountCents)}</p>
          </div>
        </div>
      </div>

      {(invoice.notes || invoice.terms) && (
        <div className="text-sm space-y-6 text-stone-500 italic border-t border-stone-200 pt-8 text-center max-w-xl mx-auto">
          {invoice.notes && <p>{invoice.notes}</p>}
          {invoice.terms && <p className="text-xs non-italic text-stone-400">{invoice.terms}</p>}
        </div>
      )}
      
      <div className="mt-16 text-center text-xs text-stone-400 tracking-widest uppercase">
        <p>Thank you for your business</p>
      </div>
    </div>
  );
}
