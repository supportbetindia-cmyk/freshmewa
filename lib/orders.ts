import type { CartLine } from "./cart";
import { indianStates } from "./content.ts";

export const MAX_QTY = 20;

export const orderStatuses = ["placed", "shipped", "delivered", "cancelled"] as const;
export type OrderStatus = (typeof orderStatuses)[number];

export type Address = {
  id: string;
  line: string;
  city: string;
  state: string;
  pincode: string;
  line2?: string;
  locality?: string;
  landmark?: string;
  name?: string;
  phone?: string;
  email?: string;
};
export type Profile = { name: string; phone: string; email: string };
export type OrderItem = CartLine & { name: string; packLabel: string; price: number; mrp: number };
export type Order = {
  id: string;
  placedAt: string;
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
export type AddressForm = Required<Omit<Address, "id">>;

const PHONE = /^[6-9]\d{9}$/;
const PINCODE = /^[1-9]\d{5}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD = 300;

export const isEmail = (s: string) => EMAIL.test(s);

type Errors<F> = Partial<Record<keyof F, string>>;

function checkAddress<F extends Omit<Address, "id"> & { phone: string }>(f: F, e: Errors<F>) {
  if (!PHONE.test(f.phone.trim())) e.phone = "Enter a valid 10-digit mobile number.";
  if (f.line.trim().length < 8) e.line = "Please enter your full address.";
  if (f.city.trim().length < 2) e.city = "Please enter your city.";
  if (!(indianStates as readonly string[]).includes(f.state)) e.state = "Please choose your state.";
  if (!PINCODE.test(f.pincode.trim())) e.pincode = "Enter a valid 6-digit pincode.";
  for (const k of Object.keys(f) as (keyof F)[]) {
    const v = f[k];
    if (typeof v === "string" && v.length > MAX_FIELD) e[k] = "That's too long.";
  }
  return e;
}

export function validateCheckout(f: CheckoutForm): Errors<CheckoutForm> {
  const e: Errors<CheckoutForm> = {};
  if (f.name.trim().length < 2) e.name = "Please enter your name.";
  if (f.email.trim() && !EMAIL.test(f.email.trim())) e.email = "Enter a valid email or leave it blank.";
  return checkAddress(f, e);
}

export function validateAddress(f: AddressForm): Errors<AddressForm> {
  const e: Errors<AddressForm> = {};
  if (!EMAIL.test(f.email.trim())) e.email = "Enter a valid email address.";
  return checkAddress(f, e);
}

export const formatAddress = (a: Omit<Address, "id">) =>
  [a.line, a.line2, a.locality, a.landmark && `Near ${a.landmark}`, a.city, `${a.state} ${a.pincode}`]
    .map((p) => p?.trim())
    .filter(Boolean)
    .join(", ");


export function newOrderId(now = Date.now()) {
  return `FM-${now.toString(36).toUpperCase()}`;
}

export const sameAddress = (a: Omit<Address, "id">, b: Omit<Address, "id">) =>
  a.line.trim().toLowerCase() === b.line.trim().toLowerCase() && a.pincode.trim() === b.pincode.trim();
