import React from "react";
import { format } from "date-fns";
import { InvoiceTemplateProps, formatMoney } from "./types";

export function ClassicInvoice({ invoice, customer, lineItems, business }: InvoiceTemplateProps) {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white p-12 font-serif text-slate-900 border border-slate-200">
      <div className="border-b-4 border-slate-900 pb-8 mb-8 flex justify-between items-end">
        <div>
          {business.logoUrl ? (
            <img src={business.logoUrl} alt={business.name} className="h-16 mb-4" />
          ) : (
            <h1 className="text-3xl font-bold uppercase tracking-wide mb-2">{business.name}</h1>
          )}
          <div className="text-sm space-y-1">
            <p>{business.address}</p>
            <p>{business.email}</p>
            {business.phone && <p>{business.phone}</p>}
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-4xl font-bold uppercase tracking-widest text-slate-900 mb-2">Invoice</h2>
          <table className="mt-4 border-collapse">
            <tbody>
              <tr>
                <td className="border border-slate-300 p-2 font-bold bg-slate-100 text-xs uppercase">Invoice No.</td>
                <td className="border border-slate-300 p-2 text-sm">{invoice.invoiceNumber}</td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-bold bg-slate-100 text-xs uppercase">Date</td>
                <td className="border border-slate-300 p-2 text-sm">{format(new Date(invoice.createdAt), "MMM dd, yyyy")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between mb-12">
        <div className="w-1/2">
          <h3 className="font-bold uppercase border-b-2 border-slate-900 mb-2 pb-1 text-sm tracking-wider">Bill To</h3>
          <div className="text-sm space-y-1">
            <p className="font-bold">{customer.companyName || customer.name}</p>
            {customer.companyName && <p>{customer.name}</p>}
            {customer.addressLine1 && <p>{customer.addressLine1}</p>}
            {(customer.city || customer.state || customer.zip) && (
              <p>{[customer.city, customer.state, customer.zip].filter(Boolean).join(", ")}</p>
            )}
            {customer.country && <p>{customer.country}</p>}
          </div>
        </div>
        <div className="w-1/3 text-right">
           <h3 className="font-bold uppercase border-b-2 border-slate-900 mb-2 pb-1 text-sm tracking-wider">Payment Due</h3>
           <p className="font-bold text-lg text-rose-700">{format(new Date(invoice.dueDate), "MMM dd, yyyy")}</p>
           <p className="text-sm mt-1">Amount Due: <span className="font-bold">{formatMoney(invoice.amountCents)}</span></p>
        </div>
      </div>

      <table className="w-full text-left text-sm mb-12 border-collapse border border-slate-900">
        <thead className="bg-slate-900 text-white">
          <tr>
            <th className="p-3 border border-slate-900 font-bold uppercase tracking-wider text-xs">Description</th>
            <th className="p-3 border border-slate-900 text-center font-bold uppercase tracking-wider text-xs w-20">Qty</th>
            <th className="p-3 border border-slate-900 text-right font-bold uppercase tracking-wider text-xs w-32">Unit Price</th>
            <th className="p-3 border border-slate-900 text-right font-bold uppercase tracking-wider text-xs w-32">Amount</th>
          </tr>
        </thead>
        <tbody>
          {lineItems.map((item) => (
            <tr key={item.id}>
              <td className="p-3 border border-slate-300">{item.description}</td>
              <td className="p-3 border border-slate-300 text-center">{item.quantity}</td>
              <td className="p-3 border border-slate-300 text-right">{formatMoney(item.unitPriceCents)}</td>
              <td className="p-3 border border-slate-300 text-right font-bold">{formatMoney(item.totalCents)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mb-12">
        <table className="w-64 border-collapse">
          <tbody>
            <tr>
              <td className="p-2 border border-slate-300 font-bold bg-slate-100 text-xs uppercase">Subtotal</td>
              <td className="p-2 border border-slate-300 text-right text-sm">{formatMoney(invoice.subtotalCents)}</td>
            </tr>
            {invoice.discountCents > 0 && (
              <tr>
                <td className="p-2 border border-slate-300 font-bold bg-slate-100 text-xs uppercase">Discount</td>
                <td className="p-2 border border-slate-300 text-right text-sm text-rose-600">-{formatMoney(invoice.discountCents)}</td>
              </tr>
            )}
            {invoice.taxCents > 0 && (
              <tr>
                <td className="p-2 border border-slate-300 font-bold bg-slate-100 text-xs uppercase">Tax</td>
                <td className="p-2 border border-slate-300 text-right text-sm">{formatMoney(invoice.taxCents)}</td>
              </tr>
            )}
            <tr>
              <td className="p-2 border border-slate-900 font-bold bg-slate-900 text-white text-sm uppercase">Total Due</td>
              <td className="p-2 border border-slate-900 text-right font-bold text-lg">{formatMoney(invoice.amountCents)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {(invoice.notes || invoice.terms) && (
        <div className="text-sm space-y-4 pt-8">
          {invoice.notes && (
            <div>
              <h4 className="font-bold uppercase tracking-wider text-xs mb-1">Notes</h4>
              <p className="italic">{invoice.notes}</p>
            </div>
          )}
          {invoice.terms && (
            <div>
              <h4 className="font-bold uppercase tracking-wider text-xs mb-1">Terms</h4>
              <p>{invoice.terms}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
