import { z } from "zod";

export const invoiceSchema = z.object({
  customerId: z.string().uuid("Invalid customer"),
  description: z.string().min(1, "Description is required"),
  amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Amount must be a positive number"),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
});

export const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
});
