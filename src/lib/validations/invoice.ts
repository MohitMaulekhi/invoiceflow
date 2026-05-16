import { z } from "zod";

export const lineItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Price must be positive"),
});

export const invoiceSchema = z.object({
  customerId: z.string().uuid("Invalid customer"),
  description: z.string().min(1, "Invoice Title/Description is required"),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  templateId: z.enum(["minimal", "modern", "classic", "bold", "elegant"]),
  notes: z.string().optional(),
  terms: z.string().optional(),
  taxRate: z.number().min(0), // percentage
  discountAmount: z.number().min(0), // flat amount
  lineItems: z.array(lineItemSchema).min(1, "At least one item is required"),
});

export const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  companyName: z.string().optional().or(z.literal("")),
  taxId: z.string().optional().or(z.literal("")),
  addressLine1: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  state: z.string().optional().or(z.literal("")),
  zip: z.string().optional().or(z.literal("")),
  country: z.string().optional().or(z.literal("")),
});
