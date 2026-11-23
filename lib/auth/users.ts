import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { auth } from "./server";

export const getUser = cache(async () => {
  await connection();
  const { data: session } = await auth.getSession();
  return session?.user;
});

export async function requireUser(next: string) {
  const user = await getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  return user;
}
export async function requireAdmin() {
  const user = await getUser();
  if (!user) redirect("/login?next=/admin/orders");
  if (user.role !== "admin") redirect("/");
  return user;
}
