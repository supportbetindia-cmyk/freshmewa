import "server-only";
import { desc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/admin";
import type { OrderStatus } from "@/lib/orders";
import { db } from ".";
import { orders } from "./schema";


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
