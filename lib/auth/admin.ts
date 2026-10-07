import "server-only";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { auth } from "./server";

/** Call at the top of every admin page and admin server action. Returns the admin user or redirects. */
export async function requireAdmin() {
  await connection(); // per-request (reads the login cookie): stops Next trying to prerender admin pages at build time
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect("/admin/login");
  if (session.user.role !== "admin") redirect("/");
  return session.user;
}
