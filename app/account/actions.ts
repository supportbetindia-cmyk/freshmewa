"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";

/** Ends the login session (deletes the neon_auth.session row + clears the cookies). */
export async function logOut() {
  await auth.signOut();
  redirect("/");
}
