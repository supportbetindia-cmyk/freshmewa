import { boolean, index, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
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
  stockTaken: boolean("stock_taken").notNull().default(false), // true while this order holds stock (false for orders placed before stock tracking, and after cancel)
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
  category: text(),                                       // display name, e.g. "Recipes"; null = uncategorised
  seoKeywords: text("seo_keywords"),                      // comma-separated; null = none
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
/** Images uploaded in the blog editor, stored in the database (the host's disk is read-only). Base64, max ~3 MB each. */
export const blogImages = pgTable("blog_images", {
  id: uuid().primaryKey().defaultRandom(),
  mime: text().notNull(),
  data: text().notNull(), // base64
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Packs in stock per product + pack size. sku = "pudina:60g" (see skuOf in lib/db/inventory.ts). */
export const inventory = pgTable("inventory", {
  sku: text().primaryKey(),
  quantity: integer().notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
