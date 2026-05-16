import { customers } from "@/db/schema/customers";

export type AppCustomer = typeof customers.$inferSelect;

export type CustomerSortOption = "newest" | "oldest" | "az";
