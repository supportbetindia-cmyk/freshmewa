"use client";

import { useSyncExternalStore } from "react";
import { sameAddress, withDefault, type Address, type Order, type Profile } from "./orders";

// ponytail: device-local account (localStorage). Replace with real auth + an orders API/DB
// before scaling — see README "Checkout & orders".

// Pure helpers live in lib/orders.ts (server-safe); re-exported so existing `@/lib/account` imports keep working.
export { formatAddress, newOrderId, sameAddress, validateAddress, validateCheckout, withDefault } from "./orders";
export type { Address, AddressForm, CheckoutForm, Order, OrderItem, Profile } from "./orders";

/** `ready` = saved data has been read from this device (false during server render). */
type AccountState = { profile: Profile | null; addresses: Address[]; orders: Order[]; ready: boolean };

const KEY = "freshmewa-account-v1";
const empty: AccountState = { profile: null, addresses: [], orders: [], ready: false };

// ── Tiny persisted store (same pattern as lib/cart.ts) ──
let state = empty;
let loaded = false;
const listeners = new Set<() => void>();

function set(next: Partial<AccountState>) {
  state = { ...state, ...next };
  const { profile, addresses, orders } = state;
  localStorage.setItem(KEY, JSON.stringify({ profile, addresses, orders }));
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!loaded) {
    loaded = true;
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "null");
      if (saved && Array.isArray(saved.orders) && Array.isArray(saved.addresses)) {
        state = { profile: saved.profile ?? null, addresses: saved.addresses, orders: saved.orders, ready: true };
      }
    } catch {
      localStorage.removeItem(KEY);
    }
    state = { ...state, ready: true };
    listeners.forEach((l) => l());
  }
  return () => listeners.delete(listener);
}

export const account = {
  /** Save the order, remember the customer + address (de-duplicated). */
  placeOrder(order: Order, email: string) {
    const known = state.addresses.some((a) => sameAddress(a, order.address));
    set({
      profile: { name: order.name, phone: order.phone, email },
      orders: [order, ...state.orders],
      // New addresses go to the end so the customer's chosen default (first) stays put.
      addresses: known ? state.addresses : [...state.addresses, order.address],
    });
  },
  /** From the "Add New Address" form. Also fills the profile if this device has none yet. */
  addAddress(address: Address, makeDefault: boolean) {
    const addresses = makeDefault || state.addresses.length === 0 ? [address, ...state.addresses] : [...state.addresses, address];
    const profile =
      state.profile ?? (address.phone ? { name: address.name ?? "", phone: address.phone, email: address.email ?? "" } : null);
    set({ addresses, profile });
  },
  setDefaultAddress: (id: string) => set({ addresses: withDefault(state.addresses, id) }),
  removeAddress: (id: string) => set({ addresses: state.addresses.filter((a) => a.id !== id) }),
  /** "Log out" on a device-local account = forget this device's data. */
  logout: () => set({ ...empty, ready: true }),
};

export function useAccount() {
  return useSyncExternalStore(subscribe, () => state, () => empty);
}
