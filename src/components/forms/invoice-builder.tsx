"use client";

import { useState, useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInvoiceAction } from "@/server/actions/invoices/create-invoice";
import { updateInvoiceAction } from "@/server/actions/invoices/update-invoice";
import { invoiceSchema } from "@/lib/validations/invoice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Loader2 } from "lucide-react";
import type { CustomerData, InvoiceData, InvoiceInput, LineItemData } from "@/types/invoice";
import { 
  MinimalInvoice, 
  ModernInvoice, 
  ClassicInvoice, 
  BoldInvoice, 
  ElegantInvoice
} from "@/components/invoices/templates";

// Removed dummyBusiness

export function InvoiceBuilder({ customers, userProfile, initialData }: { customers: any[], userProfile: any, initialData?: any }) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const isEditing = !!initialData;

  const defaultValues = initialData ? {
    templateId: initialData.invoice.templateId || "minimal",
    customerId: initialData.invoice.customerId,
    description: initialData.invoice.description,
    taxRate: initialData.invoice.subtotalCents > 0 ? (initialData.invoice.taxCents / (initialData.invoice.subtotalCents - initialData.invoice.discountCents)) * 100 || 0 : 0,
    discountAmount: initialData.invoice.discountCents / 100 || 0,
    dueDate: new Date(initialData.invoice.dueDate).toISOString().split('T')[0],
    notes: initialData.invoice.notes || "",
    terms: initialData.invoice.terms || "",
    lineItems: initialData.lineItems.length > 0 ? initialData.lineItems.map((li: any) => ({
      description: li.description,
      quantity: li.quantity,
      unitPrice: li.unitPriceCents / 100
    })) : [{ description: "", quantity: 1, unitPrice: 0 }],
  } : {
    templateId: "minimal",
    taxRate: 0,
    discountAmount: 0,
    lineItems: [{ description: "", quantity: 1, unitPrice: 0 }],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  };

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InvoiceInput>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: defaultValues as any,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lineItems",
  });

  // Watch form values to feed into live preview
  const formValues = watch();

  const onSubmit = (data: InvoiceInput) => {
    setServerError(null);
    startTransition(async () => {
      const res = isEditing 
        ? await updateInvoiceAction(initialData.invoice.id, data)
        : await createInvoiceAction(data);
        
      if (res?.error) setServerError(res.error);
    });
  };

  // Derive data for live preview
  const selectedCustomer = customers.find(c => c.id === formValues.customerId) || {
    name: "Customer Name",
    email: "customer@example.com",
    companyName: "Customer Company",
  };

  let subtotalCents = 0;
  const lineItemsData: LineItemData[] = (formValues.lineItems || []).map((item, index) => {
    const qty = item.quantity || 0;
    const price = item.unitPrice || 0;
    const totalCents = Math.round(qty * price * 100);
    subtotalCents += totalCents;
    return {
      id: String(index),
      description: item.description || "Item Description",
      quantity: qty,
      unitPriceCents: Math.round(price * 100),
      totalCents,
    };
  });

  const discountCents = Math.round((formValues.discountAmount || 0) * 100);
  const taxableCents = Math.max(0, subtotalCents - discountCents);
  const taxCents = Math.round(taxableCents * ((formValues.taxRate || 0) / 100));
  const totalCents = taxableCents + taxCents;

  const invoicePreviewData: InvoiceData = {
    invoiceNumber: "INV-PREVIEW",
    createdAt: new Date(),
    dueDate: new Date(formValues.dueDate || Date.now()),
    amountCents: totalCents,
    subtotalCents,
    taxCents,
    discountCents,
    notes: formValues.notes || null,
    terms: formValues.terms || null,
  };

  const renderTemplate = () => {
    const businessData = {
      name: userProfile?.businessName || userProfile?.name || "Your Business Name",
      email: userProfile?.email || "",
      address: userProfile?.businessAddress || "Add address in Settings",
      phone: userProfile?.businessPhone || "",
    };

    const props = {
      invoice: invoicePreviewData,
      customer: selectedCustomer as CustomerData,
      lineItems: lineItemsData,
      business: businessData,
    };

    switch (formValues.templateId) {
      case "modern": return <ModernInvoice {...props} />;
      case "classic": return <ClassicInvoice {...props} />;
      case "bold": return <BoldInvoice {...props} />;
      case "elegant": return <ElegantInvoice {...props} />;
      case "minimal": 
      default: return <MinimalInvoice {...props} />;
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 items-start">
      {/* LEFT: Builder Form */}
      <div className="w-full xl:w-[500px] shrink-0 space-y-6">
        <form id="invoice-builder-form" onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-xl pb-4">
              <CardTitle className="text-lg text-primary">Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Template Style</label>
                <Select value={formValues.templateId} onValueChange={(val) => setValue("templateId", val as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">Minimal (Stripe Style)</SelectItem>
                    <SelectItem value="modern">Modern (Teal Highlights)</SelectItem>
                    <SelectItem value="classic">Classic (Grid Layout)</SelectItem>
                    <SelectItem value="bold">Bold (High Contrast)</SelectItem>
                    <SelectItem value="elegant">Elegant (Pastel & Serif)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Customer</label>
                <Select value={formValues.customerId} onValueChange={(val) => setValue("customerId", val || "")}>
                  <SelectTrigger className={errors.customerId ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.companyName || c.name} {c.email ? `(${c.email})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.customerId && <p className="text-xs text-red-500">{errors.customerId.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Invoice Title / Description</label>
                <Input 
                  {...register("description")} 
                  placeholder="e.g., Website Redesign Services" 
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Due Date</label>
                <Input 
                  type="date" 
                  {...register("dueDate")} 
                  className={errors.dueDate ? "border-red-500" : ""}
                />
                {errors.dueDate && <p className="text-xs text-red-500">{errors.dueDate.message}</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-xl pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-primary">Line Items</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={() => append({ description: "", quantity: 1, unitPrice: 0 })} className="h-8 text-xs font-semibold gap-1">
                <Plus className="w-3 h-3" /> Add Item
              </Button>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex-1 space-y-3">
                    <Input 
                      {...register(`lineItems.${index}.description`)} 
                      placeholder="Item description" 
                      className="bg-white"
                    />
                    <div className="flex gap-3">
                      <div className="w-1/3">
                        <Input 
                          type="number" 
                          step="1" 
                          min="1" 
                          {...register(`lineItems.${index}.quantity`, { valueAsNumber: true })} 
                          placeholder="Qty" 
                          className="bg-white"
                        />
                      </div>
                      <div className="w-2/3">
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0" 
                          {...register(`lineItems.${index}.unitPrice`, { valueAsNumber: true })} 
                          placeholder="Price" 
                          className="bg-white"
                        />
                      </div>
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="text-rose-500 hover:text-rose-700 hover:bg-rose-50" onClick={() => remove(index)} disabled={fields.length === 1}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {errors.lineItems && <p className="text-xs text-red-500">{errors.lineItems.message}</p>}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-xl pb-4">
              <CardTitle className="text-lg text-primary">Totals & Extras</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Tax Rate (%)</label>
                  <Input type="number" step="0.1" min="0" {...register("taxRate", { valueAsNumber: true })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Discount (₹)</label>
                  <Input type="number" step="0.01" min="0" {...register("discountAmount", { valueAsNumber: true })} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Notes to Client</label>
                <Input {...register("notes")} placeholder="Thank you for your business!" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Terms & Conditions</label>
                <Input {...register("terms")} placeholder="Payment due upon receipt" />
              </div>
            </CardContent>
          </Card>

          {serverError && (
            <p className="text-sm text-red-600 font-medium text-center">{serverError}</p>
          )}

          <Button type="submit" className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20" disabled={isPending}>
            {isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            {isPending ? "Saving Invoice..." : isEditing ? "Save Changes" : "Create Invoice"}
          </Button>
        </form>
      </div>

      {/* RIGHT: Live Preview */}
      <div className="flex-1 w-full bg-slate-200/50 rounded-2xl p-4 md:p-8 flex justify-center border border-slate-200 overflow-hidden items-start">
        <div className="relative w-[320px] h-[452px] sm:w-[480px] sm:h-[678px] md:w-[640px] md:h-[905px] xl:w-[800px] xl:h-[1131px] transition-all duration-300">
          <div className="absolute top-0 left-0 w-[800px] h-[1131px] origin-top-left scale-[0.4] sm:scale-[0.6] md:scale-[0.8] xl:scale-100 shadow-2xl ring-1 ring-black/5 bg-white transition-transform duration-300">
            <div className="w-full h-full">
              {renderTemplate()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
