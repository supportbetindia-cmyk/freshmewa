import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { auth } from "./server";

/** One session lookup per request, however many times it's called. */
const getUser = cache(async () => {
  await connection(); // per-request (reads the login cookie)
  const { data: session } = await auth.getSession();
  return session?.user;
});

/** Call at the top of every customer-only page and server action. Returns the user, or sends them to log in and come back to `next`. */
export async function requireUser(next: string) {
  const user = await getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  return user;
}