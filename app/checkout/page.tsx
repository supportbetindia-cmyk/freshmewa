import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { requireUser } from "@/lib/auth/users";

export const metadata: Metadata = {
  title: "Checkout — Fresh Mewa",
  robots: { index: false },
};

export default async function CheckoutPage() {
  await requireUser("/checkout");

  return (
    <main className="pb-16 pt-24 lg:pt-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-ink-muted">
          <Link href="/shop" className="hover:text-forest">
            Shop
          </Link>
          <ChevronRight className="size-3.5" />
          <span aria-current="page" className="font-semibold text-forest">
            Checkout
          </span>
        </nav>
        <h1 className="poster-h2 mb-6 mt-2 text-forest">Checkout</h1>
        <CheckoutForm />
      </div>
    </main>
  );
}
