import "server-only";
import { and, asc, eq, sql } from "drizzle-orm";
import { requireUser } from "@/lib/auth/users";
import type { Address } from "@/lib/orders";
import { db } from ".";
import { addresses } from "./schema";

const isUuid = (s: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

/** The logged-in customer's addresses, default first. Like listMyOrders: no user id parameter, on purpose. */
export async function listMyAddresses(): Promise<Address[]> {
  const user = await requireUser("/account");
  const rows = await db
    .select()
    .from(addresses)
    .where(eq(addresses.userId, user.id))
    .orderBy(sql`${addresses.defaultedAt} desc nulls last`, asc(addresses.createdAt));
  return rows.map((r) => ({ ...r.address, id: r.id }));
}

export async function addMyAddress(address: Omit<Address, "id">, makeDefault = false) {
  const user = await requireUser("/account");
  await db.insert(addresses).values({ userId: user.id, address, defaultedAt: makeDefault ? new Date() : null });
}

export async function setMyDefaultAddress(id: string) {
  const user = await requireUser("/account");
  if (!isUuid(id)) return;
  await db.update(addresses).set({ defaultedAt: new Date() }).where(and(eq(addresses.id, id), eq(addresses.userId, user.id)));
}

export async function removeMyAddress(id: string) {
  const user = await requireUser("/account");
  if (!isUuid(id)) return;
  await db.delete(addresses).where(and(eq(addresses.id, id), eq(addresses.userId, user.id)));
}