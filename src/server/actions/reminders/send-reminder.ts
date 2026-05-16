"use server";

import { db } from "@/db";
import { invoices } from "@/db/schema/invoices";
import { reminders } from "@/db/schema/reminders";
import { invoiceActivities } from "@/db/schema/invoice_activities";
import { customers } from "@/db/schema/customers";
import { users } from "@/db/schema/users";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import ReminderEmail from "@/components/emails/reminder";
import { format } from "date-fns";
import * as React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReminderAction(invoiceId: string, pdfBase64?: string) {
  const session = await requireAuth();

  try {
    const invoiceDetails = await db
      .select({
        amountCents: invoices.amountCents,
        dueDate: invoices.dueDate,
        description: invoices.description,
        invoiceNumber: invoices.invoiceNumber,
        customerName: customers.name,
        customerEmail: customers.email,
        businessName: users.businessName,
        userName: users.name,
      })
      .from(invoices)
      .innerJoin(customers, eq(invoices.customerId, customers.id))
      .innerJoin(users, eq(invoices.userId, users.id))
      .where(and(eq(invoices.id, invoiceId), eq(invoices.userId, session.userId)))
      .limit(1);

    if (invoiceDetails.length === 0) throw new Error("Invoice not found or unauthorized");

    const inv = invoiceDetails[0];
    if (!inv.customerEmail) {
      throw new Error("Customer has no email address");
    }

    const amountFormatted = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(inv.amountCents / 100);
    const dueDateFormatted = format(new Date(inv.dueDate), "MMM d, yyyy");
    
    const senderName = inv.businessName || inv.userName || "Invoice Flow";

    const attachments = pdfBase64 ? [
      {
        filename: `Invoice_${inv.invoiceNumber}.pdf`,
        content: pdfBase64.split("base64,")[1] || pdfBase64,
      }
    ] : [];

    console.log("Attempting to send email via Resend to:", inv.customerEmail);
    console.log("Using API Key:", process.env.RESEND_API_KEY?.substring(0, 8) + "...");
    
    // Send Email
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "InvoiceFlow <noreply@mohitmaulekhi.xyz>",
      to: [inv.customerEmail],
      subject: `Payment Reminder from ${senderName}`,
      attachments,
      react: React.createElement(ReminderEmail, {
        senderName,
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
      await db.insert(invoiceActivities).values({
        invoiceId,
        type: "reminder",
        description: `Reminder failed to send: ${error.message || "Unknown error"}`,
      });
      revalidatePath(`/invoices/${invoiceId}`);
      throw new Error(`Email failed: ${error.message || "Unknown Resend error"}`);
    }

    // Log the reminder
    await db.insert(reminders).values({
      invoiceId,
      status: "sent",
    });
    
    await db.insert(invoiceActivities).values({
      invoiceId,
      type: "reminder",
      description: "Reminder email sent successfully",
    });

    revalidatePath(`/invoices/${invoiceId}`);
  } catch (error) {
    console.error(error);
    throw new Error(error instanceof Error ? error.message : "Failed to send reminder");
  }
}
