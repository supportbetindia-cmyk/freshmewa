import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { orderStatuses, type Address, type OrderItem } from "../orders";

/** Same shape as `Order` in lib/orders.ts, so the admin and the account page agree. Amounts in whole rupees. */
export const orders = pgTable("orders", {
  id: text().primaryKey(), // "FM-…" from newOrderId()
  status: text({ enum: orderStatuses }).notNull().default("placed"),
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



export const posts = pgTable("posts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(), // 1, 2, 3… assigned by Postgres
  slug: text().notNull().unique(),                        // URL part: /blog/why-makhana
  title: text().notNull(),
  excerpt: text().notNull().default(""),                  // short summary for cards + Google
  body: text().notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }), // null = draft (not public)
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});