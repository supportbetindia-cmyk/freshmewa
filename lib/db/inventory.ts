import "server-only";
import { and, eq, gte, sql } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/users";
import { flavours, packs } from "@/lib/content";
import { db } from ".";
import { inventory } from "./schema";

export const LOW_STOCK = 10;

export const skuOf = (slug: string, pack: string) => `${slug}:${pack}`;
export const allSkus = () => flavours.flatMap((f) => packs.map((p) => skuOf(f.slug, p.id)));

type Line = { sku: string; qty: number };

/** Public, for the storefront: sku → packs left. */
export async function getStock() {
  const rows = await db.select().from(inventory);
  return Object.fromEntries(rows.map((r) => [r.sku, r.quantity]));
}

/** Admin list: creates a row (at 0) for any product that doesn't have one yet. */
export async function listStock() {
  await requireAdmin();
  await db.insert(inventory).values(allSkus().map((sku) => ({ sku, quantity: 0 }))).onConflictDoNothing();
  return getStock();
}

export async function setStock(sku: string, quantity: number) {
  await requireAdmin();
  await db
    .insert(inventory)
    .values({ sku, quantity, updatedAt: new Date() })
    .onConflictDoUpdate({ target: inventory.sku, set: { quantity, updatedAt: new Date() } });
}

/** Takes the packs for every line, or none. Returns the sku that ran short, or null when all were taken. */
export async function takeStock(lines: Line[]): Promise<string | null> {
  const taken: Line[] = [];
  for (const line of lines) {
    // Only decrements when enough is left, so two orders can't both take the last pack.
    const [row] = await db
      .update(inventory)
      .set({ quantity: sql`${inventory.quantity} - ${line.qty}`, updatedAt: new Date() })
      .where(and(eq(inventory.sku, line.sku), gte(inventory.quantity, line.qty)))
      .returning({ sku: inventory.sku });
    if (!row) {
      await giveBack(taken);
      return line.sku;
    }
    taken.push(line);
  }
  return null;
}

export async function giveBack(lines: Line[]) {
  for (const line of lines) {
    await db
      .update(inventory)
      .set({ quantity: sql`${inventory.quantity} + ${line.qty}`, updatedAt: new Date() })
      .where(eq(inventory.sku, line.sku));
  }
}
