"use server";

import { deleteSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export async function signOutAction() {
  await deleteSession();
  redirect("/login");
}
