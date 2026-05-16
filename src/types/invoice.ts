import { z } from "zod";
import { customers } from "@/db/schema/customers";
import { invoiceActivities } from "@/db/schema/invoice_activities";
import { invoiceLineItems } from "@/db/schema/invoice_line_items";
import { invoices } from "@/db/schema/invoices";
import { invoiceSchema } from "@/lib/validations/invoice";

type InvoiceRow = typeof invoices.$inferSelect;
type CustomerRow = typeof customers.$inferSelect;
type InvoiceActivityRow = typeof invoiceActivities.$inferSelect;
type InvoiceLineItemRow = typeof invoiceLineItems.$inferSelect;

export type InvoiceStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "partially_paid"
  | "paid"
  | "overdue"
  | "voided";

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

export type InvoiceInput = z.infer<typeof invoiceSchema>;
export type InvoiceStatusFilter = InvoiceStatus | "all";

export interface InvoiceListItem {
  id: InvoiceRow["id"];
  amountCents: InvoiceRow["amountCents"];
  status: InvoiceRow["status"];
  dueDate: InvoiceRow["dueDate"];
  description: InvoiceRow["description"];
  customerName: CustomerRow["name"];
}

export interface InvoiceDetail {
  invoice: InvoiceRow;
  customer: CustomerRow;
  activities: InvoiceActivityRow[];
  lineItems: InvoiceLineItemRow[];
}
