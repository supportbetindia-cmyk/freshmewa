"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Package, Plus, Sprout, Truck } from "lucide-react";
import { checkoutSettings, formatINR, packs, productDetails, tones, type Flavour } from "@/lib/content";
import CartButtons from "../CartButtons";

/** Pack size + quantity selection, live price, Add to Cart / Buy Now. */
export default function BuyBox({ flavour: f }: { flavour: Flavour }) {
  const [packId, setPackId] = useState(packs[0].id);
  const [qty, setQty] = useState(1);
  const pack = packs.find((p) => p.id === packId) ?? packs[0];
  const off = Math.round((1 - pack.price / pack.mrp) * 100);
  const t = tones[f.tone];

  return (
    <div className="rounded-[1.75rem] border border-forest/10 bg-white/60 p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-poster text-5xl leading-none text-forest">{formatINR(pack.price * qty)}</span>
        <span className="text-lg text-ink-muted line-through">{formatINR(pack.mrp * qty)}</span>
        {off > 0 && (
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-cream ${t.solid}`}>
            {off}% off
          </span>
        )}
      </div>
      <p className="mt-1 text-xs text-ink-muted">MRP inclusive of all taxes</p>

      <fieldset className="mt-5">
        <legend className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">Pack size</legend>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {packs.map((p) => (
            <label
              key={p.id}
              className={`cursor-pointer rounded-2xl border-2 px-3 py-2.5 text-center transition-colors duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold ${
                p.id === packId ? "border-forest bg-forest text-cream" : "border-forest/15 bg-cream text-forest hover:border-forest/40"
              }`}
            >
              <input
                type="radio"
                name="pack"
                value={p.id}
                checked={p.id === packId}
                onChange={() => setPackId(p.id)}
                className="sr-only"
              />
              <span className="block font-poster text-xl leading-none">{p.label}</span>
              <span className="mt-1 block text-xs font-semibold opacity-80">{formatINR(p.price)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 flex items-center gap-4">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">Quantity</span>
        <div className="flex items-center rounded-full border border-forest/15 bg-cream">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label="Decrease quantity"
            className="grid size-10 place-items-center rounded-full text-forest hover:bg-forest/5 disabled:opacity-30"
          >
            <Minus className="size-4" />
          </button>
          <span className="w-10 text-center font-semibold tabular-nums text-forest" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(20, q + 1))}
            aria-label="Increase quantity"
            className="grid size-10 place-items-center rounded-full text-forest hover:bg-forest/5"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>

      <dl className="mt-5 overflow-hidden rounded-2xl border border-forest/10 bg-cream/80 text-sm">
        <div className="grid grid-cols-2 divide-x divide-forest/10 border-b border-forest/10">
          <div className="p-4">
            <dt className="flex items-center gap-2 font-semibold text-forest">
              <Package aria-hidden="true" className="size-4 shrink-0 text-gold" /> Your pack
            </dt>
            <dd className="mt-1.5 text-ink-muted" aria-live="polite">
              {qty} × {pack.label} <span className="block text-xs">{f.short} flavour</span>
            </dd>
          </div>
          <div className="p-4">
            <dt className="flex items-center gap-2 font-semibold text-forest">
              <Truck aria-hidden="true" className="size-4 shrink-0 text-gold" /> Delivery
            </dt>
            <dd className="mt-1.5 text-ink-muted">
              {checkoutSettings.deliveryFee === 0 ? "Free delivery" : `${formatINR(checkoutSettings.deliveryFee)} delivery`}
              <span className="block text-xs">Included in your checkout total</span>
            </dd>
          </div>
        </div>
        <div className="p-4">
          <dt className="flex items-center gap-2 font-semibold text-forest">
            <Sprout aria-hidden="true" className="size-4 shrink-0 text-gold" /> Ingredients
          </dt>
          <dd className="mt-1.5 leading-relaxed text-ink-muted">{productDetails[f.slug].ingredients}</dd>
        </div>
      </dl>

      <div className="mt-4">
        <CartButtons slug={f.slug} name={f.name} pack={packId} qty={qty} large />
      </div>
      <Link href="/shipping-returns" className="mt-3 inline-block text-xs text-ink-muted underline decoration-forest/25 underline-offset-4 hover:text-forest">
        Shipping & returns details
      </Link>
    </div>
  );
}
