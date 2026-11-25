"use client";

import { useEffect, useState } from "react";

type Stock = Record<string, number>;

/** One shared request per page load. Unknown until it arrives, so nothing shows "sold out" by mistake. */
let request: Promise<Stock | null> | null = null;
const fetchStock = () => {
  request ??= fetch("/api/stock").then((r) => (r.ok ? r.json() : null)).catch(() => null);
  return request;
};

export function useStock() {
  const [stock, setStock] = useState<Stock | null>(null);
  useEffect(() => {
    let alive = true;
    fetchStock().then((s) => alive && setStock(s));
    return () => {
      alive = false;
    };
  }, []);
  return {
    stock,
    soldOut: (slug: string, pack: string) => stock !== null && (stock[`${slug}:${pack}`] ?? 0) <= 0,
  };
}
