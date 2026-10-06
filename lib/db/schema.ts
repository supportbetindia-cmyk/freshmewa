import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import type { Address, OrderItem } from "../orders";

/** Same shape as `Order` in lib/orders.ts, so the admin and the account page agree. Amounts in whole rupees. */
export const orders = pgTable("orders", {
  id: text().primaryKey(), // "FM-…" from newOrderId()
  status: text({ enum: ["placed", "shipped", "delivered", "cancelled"] }).notNull().default("placed"),
  name: text().notNull(),
  phone: text().notNull(),
  email: text(),
  address: jsonb().$type<Address>().notNull(),
  items: jsonb().$type<OrderItem[]>().notNull(),
  subtotal: integer().notNull(),
  savings: integer().notNull().default(0),
  delivery: integer().notNull().default(0),
  total: integer().notNull(),
  payment: text({ enum: ["cod"] }).notNull().default("cod"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
