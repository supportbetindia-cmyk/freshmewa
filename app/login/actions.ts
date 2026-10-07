"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { safeNext } from "@/lib/safe-next";

export type LoginState = { step: "email" | "code"; email?: string; error?: string; sent?: boolean } | null;

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export async function emailLogin(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!isEmail(email)) return { step: "email", error: "Enter a valid email address." };

  const otp = String(formData.get("otp") ?? "").trim();
  const resend = formData.get("resend") !== null;

  if (!otp || resend) {
    const { error } = await auth.emailOtp.sendVerificationOtp({ email, type: "sign-in" });
    if (error) {
      console.error("send login code failed", error);
      return { step: resend ? "code" : "email", email, error: "Couldn't send the code. Please try again in a minute." };
    }
    return { step: "code", email, sent: resend };
  }

  // First login with this email creates the customer's account automatically.
  const { error } = await auth.signIn.emailOtp({ email, otp });
  if (error) return { step: "code", email, error: "That code is wrong or has expired." };

  redirect(safeNext(formData.get("next")));
}