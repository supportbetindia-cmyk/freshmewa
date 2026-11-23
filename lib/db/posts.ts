import "server-only";
import { and, desc, eq, isNotNull } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/users";
import { slugify } from "@/lib/content";
import { db } from ".";
import { posts } from "./schema";

export type PostInput = Pick<typeof posts.$inferInsert, "slug" | "title" | "excerpt" | "seoTitle" | "seoDescription" | "seoKeywords" | "category" | "coverImage" | "body">;

export async function listPublishedPosts(category?: string) {
  return db
    .select({ slug: posts.slug, title: posts.title, excerpt: posts.excerpt, category: posts.category, coverImage: posts.coverImage, publishedAt: posts.publishedAt })
    .from(posts)
    .where(category ? and(isNotNull(posts.publishedAt), eq(posts.category, category)) : isNotNull(posts.publishedAt))
    .orderBy(desc(posts.publishedAt));
}

/** Every category that has at least one published post, with its post count. */
export async function listPublishedCategories() {
  const rows = await listPublishedPosts();
  const counts = new Map<string, number>();
  for (const r of rows) if (r.category) counts.set(r.category, (counts.get(r.category) ?? 0) + 1);
  return [...counts].map(([name, count]) => ({ name, slug: slugify(name), count })).sort((a, b) => a.name.localeCompare(b.name));
}

/** Existing category names (drafts included), for the editor's suggestions. */
export async function listAllCategoryNames() {
  await requireAdmin();
  const rows = await db.selectDistinct({ category: posts.category }).from(posts);
  return rows.map((r) => r.category).filter((c): c is string => !!c).sort();
}

export async function getPublishedPost(slug: string) {
  const [post] = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), isNotNull(posts.publishedAt)))
    .limit(1);
  return post;
}

export async function listAllPosts() {
  await requireAdmin();
  return db
    .select({ id: posts.id, slug: posts.slug, title: posts.title, publishedAt: posts.publishedAt, updatedAt: posts.updatedAt })
    .from(posts)
    .orderBy(desc(posts.updatedAt));
}

export async function getPost(id: number) {
  await requireAdmin();
  const [post] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return post;
}

export async function createPost(data: PostInput) {
  await requireAdmin();
  const [post] = await db.insert(posts).values(data).returning({ id: posts.id });
  return post;
}

export async function updatePost(id: number, data: PostInput) {
  await requireAdmin();
  const [post] = await db.update(posts).set(data).where(eq(posts.id, id)).returning({ id: posts.id });
  return post;
}

export async function setPublished(id: number, published: boolean) {
  await requireAdmin();
  const [post] = await db
    .update(posts)
    .set({ publishedAt: published ? new Date() : null })
    .where(eq(posts.id, id))
    .returning({ slug: posts.slug });
  return post;
}

export async function deletePost(id: number) {
  await requireAdmin();
  const [post] = await db.delete(posts).where(eq(posts.id, id)).returning({ slug: posts.slug });
  return post;
}