import "server-only";
import { and, desc, eq, isNotNull } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/admin";
import { db } from ".";
import { posts } from "./schema";

/** The fields the admin form edits. Everything else (id, dates) Postgres/Drizzle fills in. */
export type PostInput = Pick<typeof posts.$inferInsert, "slug" | "title" | "excerpt" | "body">;


export async function listPublishedPosts() {
  return db
    .select({ slug: posts.slug, title: posts.title, excerpt: posts.excerpt, publishedAt: posts.publishedAt })
    .from(posts)
    .where(isNotNull(posts.publishedAt))
    .orderBy(desc(posts.publishedAt));
}

export async function getPublishedPost(slug: string) {
  const [post] = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), isNotNull(posts.publishedAt)))
    .limit(1);
  return post;
}

// ---------- Admin: every function checks the login first ----------

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
  return post; // new posts start as drafts (publishedAt = null)
}

export async function updatePost(id: number, data: PostInput) {
  await requireAdmin();
  const [post] = await db.update(posts).set(data).where(eq(posts.id, id)).returning({ id: posts.id });
  return post; // undefined = no post with that id
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