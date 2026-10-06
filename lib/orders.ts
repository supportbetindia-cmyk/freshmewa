// Pure order/address types + helpers — no "use client", so server code (server actions, the admin) can use them too.
// Checked by: node lib/account.test.ts
import type { CartLine } from "./cart";

/** Most packs of one flavour + size per order. Lives here (not lib/cart.ts, a "use client" file) so the server sees the real number. */
export const MAX_QTY = 20;

export type Address = {
  id: string;
  line: string; // full address (house / flat, street)
  city: string;
  state: string;
  pincode: string;
  line2?: string;
  locality?: string;
  landmark?: string;
  /** Contact for this address (set when added from My Addresses). */
  name?: string;
  phone?: string;
  email?: string;
};
export type Profile = { name: string; phone: string; email: string };
export type OrderItem = CartLine & { name: string; packLabel: string; price: number; mrp: number };
export type Order = {
  id: string;
  placedAt: string; // ISO date
  items: OrderItem[];
  subtotal: number;
  savings: number;
  delivery: number;
  total: number;
  payment: "cod";
  status: "Placed";
  name: string;
  phone: string;
  address: Address;
};

export type CheckoutForm = Profile & Omit<Address, "id">;

/** Returns field → message for every invalid field (empty object = valid). */
export function validateCheckout(f: CheckoutForm): Partial<Record<keyof CheckoutForm, string>> {
  const e: Partial<Record<keyof CheckoutForm, string>> = {};
  if (f.name.trim().length < 2) e.name = "Please enter your name.";
  if (!/^[6-9]\d{9}$/.test(f.phone.trim())) e.phone = "Enter a valid 10-digit mobile number.";
  if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = "Enter a valid email or leave it blank.";
  if (f.line.trim().length < 8) e.line = "Please enter your full address.";
  if (f.city.trim().length < 2) e.city = "Please enter your city.";
  if (!f.state) e.state = "Please choose your state.";
  if (!/^[1-9]\d{5}$/.test(f.pincode.trim())) e.pincode = "Enter a valid 6-digit pincode.";
  return e;
}

export type AddressForm = Required<Omit<Address, "id">>;

/** "Add New Address" form rules: mobile, email, full address, pincode, city and state are required. */
export function validateAddress(f: AddressForm): Partial<Record<keyof AddressForm, string>> {
  const e: Partial<Record<keyof AddressForm, string>> = {};
  if (!/^[6-9]\d{9}$/.test(f.phone.trim())) e.phone = "Enter a valid 10-digit mobile number.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = "Enter a valid email address.";
  if (f.line.trim().length < 8) e.line = "Please enter your full address.";
  if (!/^[1-9]\d{5}$/.test(f.pincode.trim())) e.pincode = "Enter a valid 6-digit pincode.";
  if (f.city.trim().length < 2) e.city = "Please enter your city.";
  if (!f.state) e.state = "Please choose your state.";
  return e;
}

/** One-line display of an address, skipping empty optional parts. */
export const formatAddress = (a: Omit<Address, "id">) =>
  [a.line, a.line2, a.locality, a.landmark && `Near ${a.landmark}`, a.city, `${a.state} ${a.pincode}`]
    .map((p) => p?.trim())
    .filter(Boolean)
    .join(", ");

/** Default address = first in the list. */
export function withDefault(list: Address[], id: string): Address[] {
  const hit = list.find((a) => a.id === id);
  return hit ? [hit, ...list.filter((a) => a.id !== id)] : list;
}

export function newOrderId(now = Date.now()) {
  return `FM-${now.toString(36).toUpperCase()}`;
}

export const sameAddress = (a: Omit<Address, "id">, b: Omit<Address, "id">) =>
  a.line.trim().toLowerCase() === b.line.trim().toLowerCase() && a.pincode.trim() === b.pincode.trim();
