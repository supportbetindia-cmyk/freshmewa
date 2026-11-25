import "server-only";
import { desc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/users";
import type { OrderStatus } from "@/lib/orders";
import { giveBack, skuOf, takeStock } from "./inventory";
import { db } from ".";
import { orders } from "./schema";
import { requireUser } from "@/lib/auth/users";

export async function listOrders(status?: OrderStatus) {
  await requireAdmin();
  return db
    .select({ id: orders.id, name: orders.name, phone: orders.phone, address: orders.address, total: orders.total, status: orders.status, createdAt: orders.createdAt })
    .from(orders)
    .where(status ? eq(orders.status, status) : undefined)
    .orderBy(desc(orders.createdAt))
    .limit(200);
}

export async function getOrder(id: string) {
  await requireAdmin();
  const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return order; 
}

/** Changes an order's status and keeps stock in step: cancelling returns its packs; un-cancelling takes them again. */
export async function setOrderStatus(id: string, status: OrderStatus) {
  await requireAdmin();
  const [order] = await db
    .select({ status: orders.status, items: orders.items, stockTaken: orders.stockTaken })
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1);
  if (!order) return undefined;
  const lines = order.items.map((i) => ({ sku: skuOf(i.slug, i.pack), qty: i.qty }));

  if (status === "cancelled" && order.stockTaken) {
    await giveBack(lines);
    await db.update(orders).set({ status, stockTaken: false }).where(eq(orders.id, id));
    return { id };
  }
  if (order.status === "cancelled" && status !== "cancelled" && !order.stockTaken) {
    const short = await takeStock(lines);
    if (short) return { short };
    await db.update(orders).set({ status, stockTaken: true }).where(eq(orders.id, id));
    return { id };
  }
  const [updated] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning({ id: orders.id });
  return updated ? { id: updated.id } : undefined;
}

export async function listMyOrders() {
  const user = await requireUser("/account");
  return db
    .select({ id: orders.id, createdAt: orders.createdAt, status: orders.status, items: orders.items, total: orders.total, address: orders.address })
    .from(orders)
    .where(eq(orders.userId, user.id))
    .orderBy(desc(orders.createdAt))
    .limit(50);
}

export type MyOrder = Awaited<ReturnType<typeof listMyOrders>>[number];
