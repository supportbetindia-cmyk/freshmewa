"use client";

import { useSyncExternalStore } from "react";
import { MAX_QTY } from "./orders.ts";

/** One cart line = one flavour in one pack size. */
export type CartLine = { slug: string; pack: string; qty: number };
type CartState = { lines: CartLine[]; open: boolean };

const KEY = "freshmewa-cart-v2";
const empty: CartState = { lines: [], open: false };

const same = (l: CartLine, slug: string, pack: string) => l.slug === slug && l.pack === pack;

// ── Pure line helpers (checked in cart.test.ts) ──
export function addLine(lines: CartLine[], slug: string, pack: string, qty = 1): CartLine[] {
  if (!lines.some((l) => same(l, slug, pack))) return [...lines, { slug, pack, qty: Math.min(qty, MAX_QTY) }];
  return lines.map((l) => (same(l, slug, pack) ? { ...l, qty: Math.min(l.qty + qty, MAX_QTY) } : l));
}

export function setLineQty(lines: CartLine[], slug: string, pack: string, qty: number): CartLine[] {
  if (qty <= 0) return lines.filter((l) => !same(l, slug, pack));
  return lines.map((l) => (same(l, slug, pack) ? { ...l, qty: Math.min(qty, MAX_QTY) } : l));
}

export const countItems = (lines: CartLine[]) => lines.reduce((n, l) => n + l.qty, 0);

// ── Tiny external store, persisted to localStorage ──
// ponytail: client-only cart; swap for a server cart/API when checkout is built.
let state = empty;
let loaded = false;
const listeners = new Set<() => void>();

function set(next: Partial<CartState>) {
  state = { ...state, ...next };
  if (next.lines) localStorage.setItem(KEY, JSON.stringify(state.lines));
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!loaded) {
    loaded = true;
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      if (Array.isArray(saved)) {
        set({ lines: saved.filter((l) => typeof l?.slug === "string" && typeof l?.pack === "string" && l.qty > 0) });
      }
    } catch {
      localStorage.removeItem(KEY);
    }
  }
  return () => listeners.delete(listener);
}

export const cart = {
  add: (slug: string, pack: string, qty = 1) => set({ lines: addLine(state.lines, slug, pack, qty) }),
  setQty: (slug: string, pack: string, qty: number) => set({ lines: setLineQty(state.lines, slug, pack, qty) }),
  remove: (slug: string, pack: string) => set({ lines: setLineQty(state.lines, slug, pack, 0) }),
  open: () => set({ open: true }),
  close: () => set({ open: false }),
  clear: () => set({ lines: [], open: false }),
};

export function useCart() {
  return useSyncExternalStore(subscribe, () => state, () => empty);
}
