import "server-only";
import { desc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/admin";
import type { OrderStatus } from "@/lib/orders";
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

export async function setOrderStatus(id: string, status: OrderStatus) {
  await requireAdmin();
  const [updated] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning({ id: orders.id });
  return updated;
}


/**
 * The logged-in customer's own orders. Deliberately takes NO user id:
 * it reads it from the session, so no caller can ever ask for someone else's orders.
 */
export async function listMyOrders() {
  const user = await requireUser("/account");
  return db
    .select({ id: orders.id, createdAt: orders.createdAt, status: orders.status, items: orders.items, total: orders.total, address: orders.address })
    .from(orders)
    .where(eq(orders.userId, user.id))
    .orderBy(desc(orders.createdAt))
    .limit(50); // ponytail: newest 50, add paging when a customer has more
}

export type MyOrder = Awaited<ReturnType<typeof listMyOrders>>[number];
