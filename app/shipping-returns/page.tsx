import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight, Clock3, PackageCheck, RotateCcw, Truck } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { checkoutSettings, formatINR } from "@/lib/content";

// Keep this draft out of search results until the merchant confirms the policy below.
export const metadata: Metadata = {
  title: "Shipping & Returns — Fresh Mewa",
  description: "Delivery charges, dispatch information and returns for Fresh Mewa orders.",
  robots: { index: false, follow: true },
};

export default function ShippingReturnsPage() {
  return (
    <main>
      <section className="grain relative overflow-hidden bg-cream-deep pb-12 pt-28 sm:pb-16 lg:pt-32">
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-ink-muted">
            <Link href="/" className="hover:text-forest">Home</Link>
            <ChevronRight aria-hidden="true" className="size-3.5" />
            <span aria-current="page">Shipping & Returns</span>
          </nav>
          <Reveal className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold">The little details, clearly explained</p>
              <h1 className="font-poster text-[clamp(3.5rem,8vw,7rem)] uppercase leading-[0.88] text-forest">
                Shipping <span className="text-gold">& Returns</span>
              </h1>
              <p className="mt-5 font-display text-2xl italic text-gold sm:text-3xl">From our packs to your snack drawer.</p>
            </div>
            <div className="relative rounded-[1.75rem] border-2 border-forest bg-mint-soft p-6 shadow-[6px_6px_0_var(--color-forest)] sm:p-8">
              <Truck aria-hidden="true" className="mb-5 size-12 text-forest" strokeWidth={1.3} />
              <p className="font-poster text-3xl leading-none text-forest">A little clarity before your crunch.</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">Delivery charges, order timings and what to do if something needs attention.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="rounded-2xl border border-gold/25 bg-gold-soft/20 px-5 py-4 text-sm leading-relaxed text-forest">
            <strong>Policy details are being finalised.</strong> Dispatch times, delivery estimates and return/refund terms will be added here once confirmed. The charge below reflects the current checkout setting.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { title: "Delivery charge", value: formatINR(checkoutSettings.deliveryFee), note: "Current charge per order at checkout", Icon: Truck },
              { title: "Dispatch time", value: "To be confirmed", note: "The time between ordering and shipping", Icon: PackageCheck },
              { title: "Delivery estimate", value: "To be confirmed", note: "Arrival timings for your delivery location", Icon: Clock3 },
            ].map(({ title, value, note, Icon }) => (
              <Reveal key={title} className="rounded-[1.5rem] border border-forest/10 bg-white/60 p-6">
                <Icon aria-hidden="true" className="mb-4 size-6 text-gold" strokeWidth={1.5} />
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">{title}</h2>
                <p className="mt-3 font-poster text-3xl leading-none text-forest">{value}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{note}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <Reveal id="shipping" className="scroll-mt-28 rounded-[1.75rem] bg-mint-soft/60 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <Truck aria-hidden="true" className="size-7 text-forest" strokeWidth={1.5} />
                <h2 className="font-poster text-3xl uppercase text-forest sm:text-4xl">Shipping & Delivery</h2>
              </div>
              <dl className="mt-6 divide-y divide-forest/10 text-sm leading-relaxed">
                <div className="pb-4">
                  <dt className="font-semibold text-forest">Delivery charges</dt>
                  <dd className="mt-1 text-ink-muted">Your checkout total includes the delivery charge. The current charge is {formatINR(checkoutSettings.deliveryFee)} per order; the final shipping policy is being confirmed.</dd>
                </div>
                <div className="py-4">
                  <dt className="font-semibold text-forest">Dispatch & arrival</dt>
                  <dd className="mt-1 text-ink-muted">Dispatch schedules, delivery estimates and serviceable locations are awaiting confirmation.</dd>
                </div>
                <div className="pt-4">
                  <dt className="font-semibold text-forest">Your delivery address</dt>
                  <dd className="mt-1 text-ink-muted">Check your full address, PIN code and phone number before placing an order. You can view your saved order details in My Account.</dd>
                </div>
              </dl>
            </Reveal>

            <Reveal id="returns" delay={0.08} className="scroll-mt-28 rounded-[1.75rem] bg-chilli-soft/60 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <RotateCcw aria-hidden="true" className="size-7 text-chilli" strokeWidth={1.5} />
                <h2 className="font-poster text-3xl uppercase text-forest sm:text-4xl">Returns & Refunds</h2>
              </div>
              <dl className="mt-6 divide-y divide-forest/10 text-sm leading-relaxed">
                <div className="pb-4">
                  <dt className="font-semibold text-forest">Return eligibility</dt>
                  <dd className="mt-1 text-ink-muted">Eligible reasons, product-condition requirements and the time limit for reporting an issue will be published once confirmed.</dd>
                </div>
                <div className="py-4">
                  <dt className="font-semibold text-forest">Damaged, missing or incorrect items</dt>
                  <dd className="mt-1 text-ink-muted">Keep your order number, packaging and clear photos of the issue ready. The support contact and request process are being finalised.</dd>
                </div>
                <div className="pt-4">
                  <dt className="font-semibold text-forest">Refunds & replacements</dt>
                  <dd className="mt-1 text-ink-muted">Refund methods, processing times, return shipping charges and replacement terms are awaiting confirmation.</dd>
                </div>
              </dl>
            </Reveal>
          </div>

          <Reveal className="mt-8 flex flex-col gap-5 rounded-[1.75rem] bg-forest p-6 text-cream sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <h2 className="font-poster text-3xl uppercase">Keep your order details handy.</h2>
              <p className="mt-2 text-sm leading-relaxed text-cream/75">Your order number and items are available in My Account.</p>
            </div>
            <Link href="/account" className="btn shrink-0 bg-gold-soft text-forest hover:bg-cream">
              View your orders <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
