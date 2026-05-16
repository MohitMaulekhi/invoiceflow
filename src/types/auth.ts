import type { JWTPayload } from "jose";
import { z } from "zod";
import { signInSchema, signUpSchema } from "@/lib/validations/auth";

export interface SessionPayload extends JWTPayload {
  userId: string;
  email: string;
}

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
