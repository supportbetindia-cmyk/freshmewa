"use server";

import { requireUser } from "@/lib/auth/users";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import type { CartLine } from "@/lib/cart";
import { checkoutSettings, flavours, packs } from "@/lib/content";
import { MAX_QTY, newOrderId, validateCheckout, type CheckoutForm, type Order, type OrderItem } from "@/lib/orders";

type Result =
  | { ok: true; order: Order }
  | { ok: false; error: string; errors?: Partial<Record<keyof CheckoutForm, string>> };

/**
 * Anyone can call a server action with any data, so this re-validates everything and
 * prices the order from lib/content.ts — the browser only sends what was picked (slug, pack, qty).
 */
export async function placeOrder(form: CheckoutForm, lines: CartLine[]): Promise<Result> {
  const user = await requireUser("/checkout"); // not logged in → off to /login (cart stays in the browser)

  const errors = validateCheckout(form);
  if (Object.keys(errors).length) return { ok: false, error: "Please fix the highlighted fields.", errors };

  if (!Array.isArray(lines) || lines.length === 0) return { ok: false, error: "Your cart is empty." };

  const items: OrderItem[] = [];
  for (const l of lines) {
    const flavour = flavours.find((f) => f.slug === l.slug);
    const pack = packs.find((p) => p.id === l.pack); // not packById: that falls back to the first pack
    if (!flavour || !pack || !Number.isInteger(l.qty) || l.qty < 1 || l.qty > MAX_QTY) {
      return { ok: false, error: "Something in your cart isn't available. Please refresh and try again." };
    }
    items.push({ slug: flavour.slug, pack: pack.id, qty: l.qty, name: flavour.name, packLabel: pack.label, price: pack.price, mrp: pack.mrp });
  }

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const savings = items.reduce((s, i) => s + (i.mrp - i.price) * i.qty, 0);
  const delivery = checkoutSettings.deliveryFee;

  const order: Order = {
    id: newOrderId(),
    placedAt: new Date().toISOString(),
    items,
    subtotal,
    savings,
    delivery,
    total: subtotal + delivery,
    payment: "cod",
    status: "Placed",
    name: form.name.trim(),
    phone: form.phone.trim(),
    address: { id: crypto.randomUUID(), line: form.line.trim(), city: form.city.trim(), state: form.state, pincode: form.pincode.trim() },
  };

  try {
    await db.insert(orders).values({
      id: order.id,
      userId: user.id,
      name: order.name,
      phone: order.phone,
      email: form.email.trim() || user.email, // empty at checkout → their login email
      address: order.address,
      items,
      subtotal,
      savings,
      delivery,
      total: order.total,
    });
  } catch (err) {
    console.error("placeOrder failed", err);
    return { ok: false, error: "Couldn't place your order. Please try again." };
  }

  return { ok: true, order };
}
