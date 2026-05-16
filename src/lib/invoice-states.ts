export type InvoiceStatus = "draft" | "sent" | "viewed" | "partially_paid" | "paid" | "overdue" | "voided";

export const ALLOWED_STATUS_TRANSITIONS: Record<InvoiceStatus, InvoiceStatus[]> = {
  draft: ["sent", "paid", "voided"],
  sent: ["viewed", "partially_paid", "paid", "overdue", "voided"],
  viewed: ["partially_paid", "paid", "overdue", "voided"],
  partially_paid: ["paid", "overdue", "voided"],
  overdue: ["partially_paid", "paid", "voided"],
  paid: ["voided"],
  voided: ["draft"],
};

export function canTransitionTo(currentStatus: InvoiceStatus, newStatus: InvoiceStatus): boolean {
  return ALLOWED_STATUS_TRANSITIONS[currentStatus]?.includes(newStatus) || false;
}
