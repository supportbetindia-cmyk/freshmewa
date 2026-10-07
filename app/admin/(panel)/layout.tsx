import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import { signOut } from "./actions";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-cream-deep/50">
      <header className="border-b border-forest/10 bg-forest text-cream">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <nav className="flex items-center gap-5">
            <Link href="/admin/orders" className="font-poster text-2xl">Fresh Mewa Admin</Link>
            <Link href="/admin/orders" className="text-sm text-cream/80 hover:text-cream">Orders</Link>
            <Link href="/admin/blog" className="text-sm text-cream/80 hover:text-cream">Blog</Link>
          </nav>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-cream/70 max-sm:hidden">{admin.email}</span>
            <form action={signOut}>
              <button type="submit" className="rounded-full border border-cream/30 px-4 py-1.5 hover:bg-cream hover:text-forest">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  );
}