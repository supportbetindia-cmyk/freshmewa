import { index, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { orderStatuses, type Address, type OrderItem } from "../orders";



export const orders = pgTable("orders", {
  id: text().primaryKey(),
  userId: uuid("user_id"),
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
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  slug: text().notNull().unique(),
  title: text().notNull(),
  excerpt: text().notNull().default(""),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  coverImage: text("cover_image"),
  body: text().notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});



export const addresses = pgTable("addresses", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  address: jsonb().$type<Omit<Address, "id">>().notNull(),
  defaultedAt: timestamp("defaulted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index("addresses_user_id_idx").on(t.userId),
]);