"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Check, ShoppingBag, Zap } from "lucide-react";
import { cart } from "@/lib/cart";
import { packs } from "@/lib/content";

/** Add to Cart (with a short "Added" confirmation) + Buy Now (adds, then opens the cart). */
export default function CartButtons({
  slug,
  name,
  pack = packs[0].id,
  qty = 1,
  large = false,
}: {
  slug: string;
  name: string;
  pack?: string;
  qty?: number;
  large?: boolean;
}) {
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1600);
    return () => clearTimeout(t);
  }, [added]);

  const size = large
    ? "h-14 gap-2 px-3 text-[0.95rem] tracking-[0.04em] sm:px-5 sm:text-[1.05rem] sm:tracking-[0.08em]"
    : "h-12 gap-2 px-2.5 text-[0.9rem] tracking-[0.04em] sm:px-3 sm:text-[0.95rem] sm:tracking-[0.08em]";

  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={() => {
          cart.add(slug, pack, qty);
          setAdded(true);
        }}
        aria-label={`Add ${name} to cart`}
        className={`btn overflow-hidden ${size} ${
          added ? "bg-pista text-cream" : "btn-outline bg-white/60 text-forest hover:bg-white"
        }`}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <m.span
            key={added ? "added" : "add"}
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -18, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            className="flex items-center gap-2"
          >
            {added ? <Check className="size-4" /> : <ShoppingBag className="size-4" strokeWidth={1.8} />}
            {added ? "Added" : "Add to Cart"}
          </m.span>
        </AnimatePresence>
      </button>
      <button
        type="button"
        onClick={() => {
          cart.add(slug, pack, qty);
          cart.open();
        }}
        aria-label={`Buy ${name} now`}
        className={`btn btn-primary ${size}`}
      >
        <Zap className="size-4 fill-gold-soft text-gold-soft" />
        Buy Now
      </button>
    </div>
  );
}
