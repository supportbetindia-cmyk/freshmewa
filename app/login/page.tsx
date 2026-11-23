import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/users";
import { safeNext } from "@/lib/safe-next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Log in — Fresh Mewa",
  robots: { index: false },
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const next = safeNext((await searchParams).next);
  if (await getUser()) redirect(next);

  return (
    <main className="grid min-h-[80vh] place-items-center px-5 pb-16 pt-28">
      <LoginForm next={next} />
    </main>
  );
}
