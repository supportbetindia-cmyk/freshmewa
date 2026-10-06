"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useAccount } from "@/lib/account";
import { formatINR } from "@/lib/content";

export default function OrderConfirmation({ id }: { id: string }) {
  const { orders, ready } = useAccount();
  const order = orders.find((o) => o.id === id);

  if (!ready) return <div className="min-h-[50vh]" aria-busy />;

  if (!order) {
    return (
      <div className="py-16 text-center">
        <p className="font-display text-2xl italic text-forest">We couldn&apos;t find that order on this device.</p>
        <Link href="/account" className="btn btn-primary mt-5">
          My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl rounded-[2rem] border-2 border-forest bg-cream p-6 text-center shadow-[6px_6px_0_0_var(--color-forest)] sm:p-9">
      <CheckCircle2 className="mx-auto size-14 text-pista" strokeWidth={1.6} />
      <h1 className="poster-h2 mt-3 text-forest">Order placed!</h1>
      <p className="mt-2 text-ink-muted">
        Order <span className="font-semibold text-forest">{order.id}</span> · Cash on Delivery ·{" "}
        <span className="font-semibold text-forest">{formatINR(order.total)}</span>
      </p>
      <ul className="mt-5 space-y-1 text-left text-[0.95rem] text-forest">
        {order.items.map((i) => (
          <li key={`${i.slug}:${i.pack}`} className="flex justify-between gap-3 border-b border-forest/10 pb-1">
            <span>
              {i.name} · {i.packLabel} × {i.qty}
            </span>
            <span className="tabular-nums">{formatINR(i.price * i.qty)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-left text-sm text-ink-muted">
        Delivering to {order.name}, {order.address.line}, {order.address.city}, {order.address.state} {order.address.pincode}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link href="/account" className="btn btn-primary">
          View my orders
        </Link>
        <Link href="/shop" className="btn btn-outline text-forest">
          Keep shopping
        </Link>
      </div>
    </div>
  );
}
