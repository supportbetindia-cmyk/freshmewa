"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { Award, ChevronRight, ClipboardList, ListOrdered, LogOut, MapPin, Plus, Trash2 } from "lucide-react";
import { account, formatAddress, useAccount } from "@/lib/account";
import AddressDialog from "./AddressDialog";
import { formatINR } from "@/lib/content";
import type { MyOrder } from "@/lib/db/orders";
import { logOut } from "@/app/account/actions";

const tabs = [
  { id: "orders", title: "My Orders", sub: "View History", Icon: ListOrdered },
  { id: "addresses", title: "My Addresses", sub: "View Saved", Icon: MapPin },
  { id: "loyalty", title: "My Loyalty Points", sub: "View Balance", Icon: Award },
] as const;
type Tab = (typeof tabs)[number]["id"];

const date = (d: Date | string) => new Date(d).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", year: "numeric" });

export default function AccountView({ user, orders }: { user: { name: string; email: string }; orders: MyOrder[] }) {
  const { profile, addresses, ready } = useAccount();
  const [tab, setTab] = useState<Tab>("orders");
  const dialog = useRef<HTMLDialogElement>(null);
  const lenis = useLenis();
  const openAddressForm = () => {
    lenis?.stop();
    dialog.current?.showModal();
    dialog.current?.querySelector<HTMLInputElement>('[name="name"]')?.focus();
  };

  if (!ready) return <div className="min-h-[60vh]" aria-busy />;

  return (
    <>
      {/* Header */}
      <div className="border-b border-forest/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-3 px-5 pb-8 sm:px-8">
          <h1 className="poster-h2 text-forest">My Account</h1>
          <div className="text-right">
            <p className="font-poster text-3xl leading-none text-forest">{user.name || profile?.name || "Hello!"}</p>
            <p className="mt-1 text-sm text-ink-muted">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-cream-deep/50">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 pb-20 pt-8 sm:px-8 lg:grid-cols-[22rem_1fr] lg:gap-10 lg:pb-24 lg:pt-12">
          {/* Side nav */}
          <div className="space-y-4">
            <nav aria-label="Account" className="overflow-hidden rounded-[1.5rem] border border-forest/10 bg-white">
              {tabs.map(({ id, title, sub, Icon }) => {
                const on = tab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTab(id)}
                    aria-current={on ? "page" : undefined}
                    className={`flex w-full items-center gap-4 border-b border-forest/10 px-5 py-5 text-left transition-colors last:border-0 ${
                      on ? "bg-gold-soft/30 shadow-[inset_-4px_0_0_var(--color-forest)]" : "hover:bg-cream"
                    }`}
                  >
                    <Icon className="size-6 shrink-0 text-forest" strokeWidth={1.6} />
                    <span className="flex-1">
                      <span className="block text-lg font-semibold text-forest">{title}</span>
                      <span className={`text-sm ${on ? "text-gold" : "text-ink-muted"}`}>{sub}</span>
                    </span>
                    <ChevronRight className="size-5 text-forest/60" />
                  </button>
                );
              })}
            </nav>
            {/* Server ends the session; onSubmit first clears this device's saved addresses */}
            <form action={logOut} onSubmit={() => account.logout()}>
              <button type="submit" className="btn btn-outline w-full gap-2 bg-white text-forest">
                <LogOut className="size-4" /> Log out
              </button>
            </form>
          </div>

          {/* Panel */}
          <section aria-live="polite" className="min-h-[28rem] rounded-[1.5rem] bg-white/70 p-5 sm:p-8">
            {tab === "orders" && (
              <>
                <h2 className="font-poster text-4xl text-forest">My Orders</h2>
                {orders.length === 0 ? (
                  <Empty title="No orders found" text="You have not placed any orders yet" />
                ) : (
                  <ul className="mt-5 space-y-4">
                    {orders.map((o) => (
                      <li key={o.id} className="rounded-2xl border border-forest/10 bg-cream p-4 sm:p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-semibold text-forest">
                            {o.id} <span className="font-normal text-ink-muted">· {date(o.createdAt)}</span>
                          </p>
                          <span className="rounded-full bg-mint-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-mint">
                            {o.status}
                          </span>
                        </div>
                        <ul className="mt-3 space-y-1 text-[0.95rem] text-forest">
                          {o.items.map((i) => (
                            <li key={`${i.slug}:${i.pack}`} className="flex justify-between gap-3">
                              <span>
                                {i.name} · {i.packLabel} × {i.qty}
                              </span>
                              <span className="tabular-nums">{formatINR(i.price * i.qty)}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 flex flex-wrap items-end justify-between gap-2 border-t border-forest/10 pt-3 text-sm text-ink-muted">
                          <span>
                            Cash on Delivery · {o.address.city}, {o.address.pincode}
                          </span>
                          <span className="font-poster text-2xl text-forest">{formatINR(o.total)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}

            {tab === "addresses" && (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-poster text-4xl text-forest">My Addresses</h2>
                  {addresses.length > 0 && (
                    <button type="button" onClick={openAddressForm} className="btn btn-outline h-11 gap-2 bg-white text-forest">
                      <Plus className="size-4" /> Add New Address
                    </button>
                  )}
                </div>
                {addresses.length === 0 ? (
                  <Empty
                    title="No saved addresses"
                    text="Add one now, or it'll be saved when you check out"
                    action={
                      <button type="button" onClick={openAddressForm} className="btn btn-primary mt-6 gap-2">
                        <Plus className="size-4" /> Add New Address
                      </button>
                    }
                  />
                ) : (
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {addresses.map((a, i) => (
                      <li
                        key={a.id}
                        className={`relative flex flex-col rounded-2xl border bg-cream p-4 pr-12 text-[0.95rem] text-forest ${
                          i === 0 ? "border-forest" : "border-forest/10"
                        }`}
                      >
                        {i === 0 && (
                          <span className="mb-1.5 w-fit rounded-full bg-forest px-2.5 py-0.5 text-[0.7rem] font-bold uppercase tracking-wider text-cream">
                            Default
                          </span>
                        )}
                        {(a.name || a.phone) && (
                          <p className="font-semibold">
                            {a.name}
                            {a.name && a.phone && " · "}
                            {a.phone && `+91 ${a.phone}`}
                          </p>
                        )}
                        <p className="leading-relaxed text-ink">{formatAddress(a)}</p>
                        {i > 0 && (
                          <button
                            type="button"
                            onClick={() => account.setDefaultAddress(a.id)}
                            className="mt-2 w-fit text-sm font-semibold text-forest underline decoration-forest/25 underline-offset-4 hover:decoration-forest"
                          >
                            Set as default
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => account.removeAddress(a.id)}
                          aria-label={`Remove address ${a.line}`}
                          className="absolute right-3 top-3 grid size-8 place-items-center rounded-full text-ink-muted hover:bg-chilli-soft hover:text-chilli"
                        >
                          <Trash2 className="size-4" strokeWidth={1.6} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <AddressDialog ref={dialog} profile={profile} />
              </>
            )}

            {tab === "loyalty" && (
              <>
                <h2 className="font-poster text-4xl text-forest">My Loyalty Points</h2>
                <Empty title="Coming soon" text="Loyalty points aren't live yet — we'll let you know when they are" />
              </>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

function Empty({ title, text, action }: { title: string; text: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center py-14 text-center">
      <span className="grid size-24 place-items-center rounded-3xl bg-cream-deep text-forest/50">
        <ClipboardList className="size-12" strokeWidth={1.2} />
      </span>
      <p className="mt-5 text-2xl font-bold text-forest">{title}</p>
      <p className="mt-1 text-lg text-ink-muted">{text}</p>
      {action ?? (
        <Link href="/shop#range" className="btn btn-primary mt-6">
          Start shopping
        </Link>
      )}
    </div>
  );
}
