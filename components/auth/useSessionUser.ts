"use client";

import { useEffect, useState } from "react";

export type SessionUser = { name: string; email: string };

/** Shared request: every navbar render on the page reuses one check. A login/logout reloads the page, so this never goes stale. */
let request: Promise<SessionUser | null> | null = null;

function fetchUser() {
  request ??= fetch("/api/auth/get-session", { credentials: "same-origin" })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => (d?.user ? { name: d.user.name ?? "", email: d.user.email as string } : null))
    .catch(() => null);
  return request;
}

/** undefined = still checking, null = logged out, otherwise the logged-in customer. */
export function useSessionUser() {
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined);
  useEffect(() => {
    let alive = true;
    fetchUser().then((u) => alive && setUser(u));
    return () => {
      alive = false;
    };
  }, []);
  return user;
}
