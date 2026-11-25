"use server";

import { requireUser } from "@/lib/auth/users";
import { db } from "@/lib/db";
import { giveBack, skuOf, takeStock } from "@/lib/db/inventory";
import { orders } from "@/lib/db/schema";
import type { CartLine } from "@/lib/cart";
import { checkoutSettings, flavours, packs } from "@/lib/content";
import { MAX_QTY, newOrderId, validateCheckout, type CheckoutForm, type Order, type OrderItem } from "@/lib/orders";

type Result =
  | { ok: true; order: Order }
  | { ok: false; error: string; errors?: Partial<Record<keyof CheckoutForm, string>> };

export async function placeOrder(form: CheckoutForm, lines: CartLine[]): Promise<Result> {
  const user = await requireUser("/checkout");

  const errors = validateCheckout(form);
  if (Object.keys(errors).length) return { ok: false, error: "Please fix the highlighted fields.", errors };

  if (!Array.isArray(lines) || lines.length === 0) return { ok: false, error: "Your cart is empty." };

  const items: OrderItem[] = [];
  for (const l of lines) {
    const flavour = flavours.find((f) => f.slug === l.slug);
    const pack = packs.find((p) => p.id === l.pack);
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

  const stockLines = items.map((i) => ({ sku: skuOf(i.slug, i.pack), qty: i.qty }));
  const short = await takeStock(stockLines);
  if (short) {
    const item = items.find((i) => skuOf(i.slug, i.pack) === short)!;
    return { ok: false, error: `Sorry, ${item.name} (${item.packLabel}) just sold out. Please update your cart.` };
  }

  try {
    await db.insert(orders).values({
      stockTaken: true,
      id: order.id,
      userId: user.id,
      name: order.name,
      phone: order.phone,
      email: form.email.trim() || user.email,
      address: order.address,
      items,
      subtotal,
      savings,
      delivery,
      total: order.total,
    });
  } catch (err) {
    console.error("placeOrder failed", err);
    await giveBack(stockLines);
    return { ok: false, error: "Couldn't place your order. Please try again." };
  }

  return { ok: true, order };
}
