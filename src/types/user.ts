import { users } from "@/db/schema/users";

export type UserProfile = Omit<typeof users.$inferSelect, "passwordHash" | "createdAt">;
