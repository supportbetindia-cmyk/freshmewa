"use client";

import { useSyncExternalStore } from "react";
import { sameAddress, type Address, type Order, type Profile } from "./orders";


export { formatAddress, validateCheckout } from "./orders";
export type { Address, CheckoutForm } from "./orders";

type AccountState = { profile: Profile | null; addresses: Address[]; orders: Order[]; ready: boolean };

const KEY = "freshmewa-account-v1";
const empty: AccountState = { profile: null, addresses: [], orders: [], ready: false };

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
  placeOrder(order: Order, email: string) {
    const known = state.addresses.some((a) => sameAddress(a, order.address));
    set({
      profile: { name: order.name, phone: order.phone, email },
      orders: [order, ...state.orders],
      addresses: known ? state.addresses : [...state.addresses, order.address],
    });
  },
  logout: () => set({ ...empty, ready: true }),
};

export function useAccount() {
  return useSyncExternalStore(subscribe, () => state, () => empty);
}
