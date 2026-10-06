"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, m } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { cart, countItems, useCart } from "@/lib/cart";
import { flavours, formatINR, packById, tones } from "@/lib/content";
import { ease } from "@/lib/motion";
import pouch from "@/public/images/hero/makhana-pouch.webp";

const bySlug = Object.fromEntries(flavours.map((f) => [f.slug, f]));

/** Slide-in cart. Open/close state lives in the cart store so any button can open it. */
export default function CartDrawer() {
  const { lines, open } = useCart();
  const items = lines.filter((l) => bySlug[l.slug]);
  const count = countItems(items);
  const subtotal = items.reduce((sum, l) => sum + packById(l.pack).price * l.qty, 0);
  const savings = items.reduce((sum, l) => sum + (packById(l.pack).mrp - packById(l.pack).price) * l.qty, 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          <m.div
            key="cart-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={cart.close}
            className="fixed inset-0 z-[60] bg-forest/30 backdrop-blur-[2px]"
          />
          <m.aside
            key="cart"
            role="dialog"
            aria-modal="true"
            aria-label="Your cart"
            data-lenis-prevent
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease }}
            className="fixed inset-y-0 right-0 z-[70] flex w-[min(92vw,420px)] flex-col bg-cream shadow-[-20px_0_60px_-30px_rgba(30,52,24,0.4)]"
          >
            <header className="flex items-center justify-between border-b border-forest/10 px-5 py-4">
              <h2 className="font-poster text-3xl uppercase leading-none text-forest">
                Your Cart <span className="text-gold">({count})</span>
              </h2>
              <button
                type="button"
                onClick={cart.close}
                aria-label="Close cart"
                autoFocus
                className="grid size-10 place-items-center rounded-full text-forest hover:bg-forest/5"
              >
                <X className="size-5" strokeWidth={1.6} />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <span className="grid size-16 place-items-center rounded-full bg-gold-soft/50 text-forest">
                  <ShoppingBag className="size-7" strokeWidth={1.5} />
                </span>
                <p className="font-display text-2xl italic text-forest">Your snack drawer is empty.</p>
                <Link href="/shop#range" onClick={cart.close} className="btn btn-primary">
                  Browse Makhana
                </Link>
              </div>
            ) : (
              <ul className="flex-1 divide-y divide-forest/10 overflow-y-auto px-5">
                <AnimatePresence initial={false}>
                  {items.map((l) => {
                    const f = bySlug[l.slug];
                    const t = tones[f.tone];
                    const p = packById(l.pack);
                    return (
                      <m.li
                        key={`${l.slug}:${l.pack}`}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 24 }}
                        transition={{ duration: 0.35, ease }}
                        className="flex gap-4 py-4"
                      >
                        <div className={`grid size-20 shrink-0 place-items-center rounded-2xl ${t.soft}`}>
                          <Image src={pouch} alt="" sizes="3rem" className="h-auto w-12" />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-poster text-xl uppercase leading-tight text-forest">{f.name}</p>
                            <button
                              type="button"
                              onClick={() => cart.remove(l.slug, l.pack)}
                              aria-label={`Remove ${f.name}`}
                              className="grid size-8 shrink-0 place-items-center rounded-full text-ink-muted hover:bg-chilli-soft hover:text-chilli"
                            >
                              <Trash2 className="size-4" strokeWidth={1.6} />
                            </button>
                          </div>
                          <p className={`text-sm font-semibold ${t.text}`}>
                            {p.label} · {formatINR(p.price)}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex w-fit items-center rounded-full border border-forest/15">
                              <button
                                type="button"
                                onClick={() => cart.setQty(l.slug, l.pack, l.qty - 1)}
                                aria-label={`Decrease ${f.name} quantity`}
                                className="grid size-8 place-items-center rounded-full text-forest hover:bg-forest/5"
                              >
                                <Minus className="size-3.5" />
                              </button>
                              <span className="w-8 text-center text-sm font-semibold tabular-nums text-forest" aria-live="polite">
                                {l.qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => cart.setQty(l.slug, l.pack, l.qty + 1)}
                                aria-label={`Increase ${f.name} quantity`}
                                className="grid size-8 place-items-center rounded-full text-forest hover:bg-forest/5"
                              >
                                <Plus className="size-3.5" />
                              </button>
                            </div>
                            <span className="font-semibold tabular-nums text-forest">{formatINR(p.price * l.qty)}</span>
                          </div>
                        </div>
                      </m.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            )}

            {items.length > 0 && (
              <footer className="border-t border-forest/10 bg-cream-deep/60 px-5 py-4">
                <div className="flex items-baseline justify-between">
                  <span className="font-poster text-xl uppercase text-forest">Subtotal</span>
                  <span className="font-poster text-2xl text-forest">{formatINR(subtotal)}</span>
                </div>
                {savings > 0 && <p className="text-sm font-semibold text-pista">You save {formatINR(savings)} on MRP</p>}
                <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                  Pricing, stock and delivery details are displayed at the time of purchase.
                </p>
                <Link href="/checkout" onClick={cart.close} className="btn btn-primary mt-3 w-full">
                  Checkout · {count} {count === 1 ? "pack" : "packs"}
                </Link>
              </footer>
            )}
          </m.aside>
        </>
      )}
    </AnimatePresence>
  );
}
