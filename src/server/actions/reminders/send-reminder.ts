"use server";

import { db } from "@/db";
import { invoices } from "@/db/schema/invoices";
import { reminders } from "@/db/schema/reminders";
import { customers } from "@/db/schema/customers";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import ReminderEmail from "@/components/emails/reminder";
import { format } from "date-fns";
import * as React from "react";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key");

export async function sendReminderAction(invoiceId: string) {
  const session = await requireAuth();

  try {
    const invoiceDetails = await db
      .select({
        amountCents: invoices.amountCents,
        dueDate: invoices.dueDate,
        description: invoices.description,
        customerName: customers.name,
        customerEmail: customers.email,
      })
      .from(invoices)
      .innerJoin(customers, eq(invoices.customerId, customers.id))
      .where(and(eq(invoices.id, invoiceId), eq(invoices.userId, session.userId)))
      .limit(1);

    if (invoiceDetails.length === 0) throw new Error("Invoice not found or unauthorized");

    const inv = invoiceDetails[0];
    if (!inv.customerEmail) {
      throw new Error("Customer has no email address");
    }

    const amountFormatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(inv.amountCents / 100);
    const dueDateFormatted = format(new Date(inv.dueDate), "MMM d, yyyy");

    console.log("Attempting to send email via Resend to:", inv.customerEmail);
    console.log("Using API Key:", process.env.RESEND_API_KEY?.substring(0, 8) + "...");
    
    // Send Email
    const { data, error } = await resend.emails.send({
      from: "BinaryAutomates <onboarding@resend.dev>",
      to: [inv.customerEmail],
      subject: `Payment Reminder: ${inv.description}`,
      react: React.createElement(ReminderEmail, {
        customerName: inv.customerName,
        invoiceDescription: inv.description,
        amountFormatted,
        dueDateFormatted,
      }),
    });

    console.log("Resend response data:", data);

    if (error) {
      console.error("Resend API Error:", error);
      await db.insert(reminders).values({
        invoiceId,
        status: "failed",
      });
      revalidatePath(`/invoices/${invoiceId}`);
      // Throw the actual Resend error message instead of generic
      throw new Error(`Email failed: ${error.message || "Unknown Resend error"}`);
    }

    // Log the reminder
    await db.insert(reminders).values({
      invoiceId,
      status: "sent",
    });

    revalidatePath(`/invoices/${invoiceId}`);
  } catch (error) {
    console.error(error);
    throw new Error(error instanceof Error ? error.message : "Failed to send reminder");
  }
}
