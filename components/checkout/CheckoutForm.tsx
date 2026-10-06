"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Banknote, CreditCard, Lock, MapPin, ShoppingBag } from "lucide-react";
import { account, useAccount, validateCheckout, type Address, type CheckoutForm as Form } from "@/lib/account";
import { placeOrder } from "@/app/checkout/actions";
import { cart, countItems, useCart } from "@/lib/cart";
import { checkoutSettings, flavours, formatINR, indianStates, packById, tones } from "@/lib/content";
import pouch from "@/public/images/hero/makhana-pouch.webp";

const bySlug = Object.fromEntries(flavours.map((f) => [f.slug, f]));
const fields: (keyof Form)[] = ["name", "phone", "email", "line", "city", "state", "pincode"];

/** Checkout has one address line, so fold a saved address's optional parts into it (nothing gets lost). */
const fullLine = (a: Address) =>
  [a.line, a.line2, a.locality, a.landmark && `Near ${a.landmark}`].map((p) => p?.trim()).filter(Boolean).join(", ");

const input =
  "mt-1.5 h-12 w-full rounded-xl border border-forest/20 bg-white px-4 text-[0.98rem] text-forest outline-none transition-[border-color,box-shadow] placeholder:text-ink-muted/60 focus:border-forest focus:ring-4 focus:ring-gold-soft/50 aria-[invalid=true]:border-chilli";

export default function CheckoutForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const { lines } = useCart();
  const { profile, addresses, ready } = useAccount();
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [placing, setPlacing] = useState(false);
  const [serverError, setServerError] = useState("");

  const items = lines.filter((l) => bySlug[l.slug]);
  const subtotal = items.reduce((s, l) => s + packById(l.pack).price * l.qty, 0);
  const savings = items.reduce((s, l) => s + (packById(l.pack).mrp - packById(l.pack).price) * l.qty, 0);
  const delivery = checkoutSettings.deliveryFee;
  const total = subtotal + delivery;
  const last = addresses[0];

  const fillAddress = (a: (typeof addresses)[number]) => {
    const f = formRef.current;
    if (!f) return;
    for (const k of ["city", "state", "pincode"] as const) {
      (f.elements.namedItem(k) as HTMLInputElement).value = a[k];
    }
    (f.elements.namedItem("line") as HTMLInputElement).value = fullLine(a);
    setErrors((e) => ({ ...e, line: undefined, city: undefined, state: undefined, pincode: undefined }));
  };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (placing || items.length === 0) return;
    const el = e.currentTarget; // React clears e.currentTarget after an await
    const data = new FormData(el);
    const form = Object.fromEntries(fields.map((k) => [k, String(data.get(k) ?? "").trim()])) as Form;
    const found = validateCheckout(form);
    setErrors(found);
    setServerError("");
    const firstBad = fields.find((k) => found[k]);
    if (firstBad) {
      (el.elements.namedItem(firstBad) as HTMLElement)?.focus();
      return;
    }

    // The server re-checks everything and prices the order itself, then saves it to the database.
    setPlacing(true);
    const res = await placeOrder(form, items).catch(() => ({ ok: false, error: "Couldn't reach the store. Check your connection and try again." }) as const);
    if (!res.ok) {
      setPlacing(false);
      setServerError(res.error);
      if ("errors" in res && res.errors) setErrors(res.errors);
      return;
    }
    const order = res.order;
    account.placeOrder(order, form.email);
    cart.clear();

    // Hand the order to the store's WhatsApp (if configured) so it actually reaches the team.
    if (checkoutSettings.orderWhatsApp) {
      const text = [
        `New order ${order.id} (Cash on Delivery)`,
        ...order.items.map((i) => `• ${i.name} ${i.packLabel} × ${i.qty} = ${formatINR(i.price * i.qty)}`),
        `Total: ${formatINR(order.total)}`,
        `${order.name}, ${order.phone}`,
        `${order.address.line}, ${order.address.city}, ${order.address.state} ${order.address.pincode}`,
      ].join("\n");
      window.open(`https://wa.me/${checkoutSettings.orderWhatsApp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    }
    router.push(`/checkout/success?order=${order.id}`);
  }

  // Cart + account load from this device together; wait so we don't flash "empty cart".
  if (!ready) return <div className="min-h-[60vh]" aria-busy />;

  if (items.length === 0 && !placing) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-gold-soft/50 text-forest">
          <ShoppingBag className="size-7" strokeWidth={1.5} />
        </span>
        <p className="font-display text-2xl italic text-forest">Your cart is empty.</p>
        <Link href="/shop#range" className="btn btn-primary">
          Browse Makhana
        </Link>
      </div>
    );
  }

  const err = (k: keyof Form) =>
    errors[k] ? (
      <p id={`${k}-err`} className="mt-1 text-sm font-medium text-chilli">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: keyof Form) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${k}-err` : undefined });

  return (
    <form
      ref={formRef}
      key={profile?.phone ?? "guest"} // remount once saved details load from the device
      onSubmit={submit}
      noValidate
      className="grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:items-start lg:gap-10"
    >
      <div className="space-y-5">
        {/* Contact */}
        <fieldset className="rounded-[1.5rem] border border-forest/10 bg-white/60 p-5 sm:p-6">
          <legend className="sr-only">Contact details</legend>
          <h2 className="font-poster text-2xl text-forest">1. Contact</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-forest sm:col-span-2">
              Full name
              <input name="name" autoComplete="name" defaultValue={profile?.name} className={input} {...aria("name")} />
              {err("name")}
            </label>
            <label className="block text-sm font-semibold text-forest">
              Mobile number
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 mt-[3px] -translate-y-1/2 text-[0.98rem] text-ink-muted">+91</span>
                <input
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={10}
                  defaultValue={profile?.phone}
                  className={`${input} pl-12`}
                  {...aria("phone")}
                />
              </div>
              {err("phone")}
            </label>
            <label className="block text-sm font-semibold text-forest">
              Email <span className="font-normal text-ink-muted">(optional)</span>
              <input name="email" type="email" autoComplete="email" defaultValue={profile?.email} className={input} {...aria("email")} />
              {err("email")}
            </label>
          </div>
        </fieldset>

        {/* Address */}
        <fieldset className="rounded-[1.5rem] border border-forest/10 bg-white/60 p-5 sm:p-6">
          <legend className="sr-only">Delivery address</legend>
          <h2 className="font-poster text-2xl text-forest">2. Delivery address</h2>
          {addresses.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {addresses.slice(0, 3).map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => fillAddress(a)}
                  className="flex max-w-full items-center gap-2 rounded-full border border-forest/20 bg-cream px-3.5 py-1.5 text-left text-sm text-forest hover:border-forest"
                >
                  <MapPin className="size-4 shrink-0 text-pista" />
                  <span className="truncate">
                    {a.line}, {a.city}
                  </span>
                </button>
              ))}
            </div>
          )}
          <div className="mt-3 grid gap-4 sm:grid-cols-6">
            <label className="block text-sm font-semibold text-forest sm:col-span-6">
              House / flat, street, area
              <input name="line" autoComplete="street-address" defaultValue={last && fullLine(last)} className={input} {...aria("line")} />
              {err("line")}
            </label>
            <label className="block text-sm font-semibold text-forest sm:col-span-2">
              City
              <input name="city" autoComplete="address-level2" defaultValue={last?.city} className={input} {...aria("city")} />
              {err("city")}
            </label>
            <label className="block text-sm font-semibold text-forest sm:col-span-2">
              State
              <select name="state" autoComplete="address-level1" defaultValue={last?.state ?? ""} className={input} {...aria("state")}>
                <option value="" disabled>
                  Choose…
                </option>
                {indianStates.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              {err("state")}
            </label>
            <label className="block text-sm font-semibold text-forest sm:col-span-2">
              Pincode
              <input
                name="pincode"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={6}
                defaultValue={last?.pincode}
                className={input}
                {...aria("pincode")}
              />
              {err("pincode")}
            </label>
          </div>
        </fieldset>

        {/* Payment */}
        <fieldset className="rounded-[1.5rem] border border-forest/10 bg-white/60 p-5 sm:p-6">
          <legend className="sr-only">Payment</legend>
          <h2 className="font-poster text-2xl text-forest">3. Payment</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-forest bg-cream p-4 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold">
              <input type="radio" name="payment" value="cod" defaultChecked className="size-4 accent-forest" />
              <Banknote className="size-5 text-forest" />
              <span>
                <span className="block font-semibold text-forest">Cash on Delivery</span>
                <span className="text-sm text-ink-muted">Pay when your order arrives</span>
              </span>
            </label>
            <div aria-disabled className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-forest/15 p-4 opacity-60">
              <CreditCard className="size-5 text-forest" />
              <span>
                <span className="block font-semibold text-forest">UPI / Cards</span>
                <span className="text-sm text-ink-muted">Coming soon</span>
              </span>
            </div>
          </div>
        </fieldset>
      </div>

      {/* Summary */}
      <aside className="rounded-[1.75rem] border-2 border-forest bg-cream p-5 shadow-[6px_6px_0_0_var(--color-forest)] sm:p-6 lg:sticky lg:top-24">
        <h2 className="font-poster text-2xl text-forest">Order summary · {countItems(items)}</h2>
        <ul className="mt-3 divide-y divide-forest/10">
          {items.map((l) => {
            const f = bySlug[l.slug];
            const p = packById(l.pack);
            return (
              <li key={`${l.slug}:${l.pack}`} className="flex items-center gap-3 py-3">
                <span className={`relative grid size-14 shrink-0 place-items-center rounded-xl ${tones[f.tone].soft}`}>
                  <Image src={pouch} alt="" sizes="2.5rem" className="h-auto w-9" />
                  <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-forest text-[0.65rem] font-bold text-cream">
                    {l.qty}
                  </span>
                </span>
                <span className="flex-1 text-sm">
                  <span className="block font-semibold text-forest">{f.name}</span>
                  <span className="text-ink-muted">{p.label}</span>
                </span>
                <span className="font-semibold tabular-nums text-forest">{formatINR(p.price * l.qty)}</span>
              </li>
            );
          })}
        </ul>
        <dl className="mt-2 space-y-1.5 border-t border-forest/10 pt-3 text-sm">
          <div className="flex justify-between text-ink-muted">
            <dt>Subtotal</dt>
            <dd className="tabular-nums">{formatINR(subtotal)}</dd>
          </div>
          {savings > 0 && (
            <div className="flex justify-between font-semibold text-pista">
              <dt>You save on MRP</dt>
              <dd className="tabular-nums">−{formatINR(savings)}</dd>
            </div>
          )}
          <div className="flex justify-between text-ink-muted">
            <dt>Delivery</dt>
            <dd className="tabular-nums">{delivery ? formatINR(delivery) : "Free"}</dd>
          </div>
          <div className="flex items-baseline justify-between border-t border-forest/10 pt-2 text-forest">
            <dt className="font-poster text-xl">Total</dt>
            <dd className="font-poster text-3xl tabular-nums">{formatINR(total)}</dd>
          </div>
        </dl>
        <button type="submit" disabled={placing} className="btn btn-primary mt-5 w-full disabled:opacity-60">
          {placing ? "Placing order…" : `Place order · ${formatINR(total)}`}
        </button>
        {serverError && (
          <p role="alert" className="mt-3 text-center text-sm font-medium text-chilli">
            {serverError}
          </p>
        )}
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-muted">
          <Lock className="size-3.5" /> Pricing, stock and delivery details are displayed at the time of purchase.
        </p>
      </aside>
    </form>
  );
}
