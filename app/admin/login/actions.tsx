"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";

export async function signIn(_prev: { error: string } | null, formData: FormData) {
  const { error } = await auth.signIn.email({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  if (error) {
    console.error("admin sign-in failed", error);
    return { error: "Wrong email or password." };
  }

  redirect("/admin/orders");
}