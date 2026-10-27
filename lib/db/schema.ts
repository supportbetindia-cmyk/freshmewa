import { index, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { orderStatuses, type Address, type OrderItem } from "../orders";



export const orders = pgTable("orders", {
  id: text().primaryKey(), // "FM-…" from newOrderId()
  userId: uuid("user_id"), // neon_auth.user.id of the customer; null = placed before login was required
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
}, (t) => [
  index("orders_user_id_idx").on(t.userId), 
]);



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



export const addresses = pgTable("addresses", {
  id: uuid().primaryKey().defaultRandom(), // Postgres makes a random id
  userId: uuid("user_id").notNull(), // neon_auth.user.id — whose address this is
  address: jsonb().$type<Omit<Address, "id">>().notNull(),
  defaultedAt: timestamp("defaulted_at", { withTimezone: true }), // when "Make default" was last clicked; newest = the default
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index("addresses_user_id_idx").on(t.userId),
]);