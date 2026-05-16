export interface InvoiceData {
  invoiceNumber: string;
  createdAt: Date;
  dueDate: Date;
  amountCents: number;
  subtotalCents: number;
  taxCents: number;
  discountCents: number;
  notes: string | null;
  terms: string | null;
}

export interface CustomerData {
  name: string;
  email: string | null;
  companyName: string | null;
  phone: string | null;
  taxId: string | null;
  addressLine1: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
}

export interface LineItemData {
  id: string;
  description: string;
  quantity: number;
  unitPriceCents: number;
  totalCents: number;
}

export interface BusinessData {
  name: string;
  email: string;
  address: string;
  phone?: string;
  logoUrl?: string;
}

export interface InvoiceTemplateProps {
  invoice: InvoiceData;
  customer: CustomerData;
  lineItems: LineItemData[];
  business: BusinessData;
}

export function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(cents / 100);
}
