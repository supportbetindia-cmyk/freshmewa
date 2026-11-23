import type { Metadata } from "next";
import { listPublishedPosts } from "@/lib/db/posts";
import PostCard from "./PostCard";

export const metadata: Metadata = {
  title: "Blog — Fresh Mewa",
  description: "Makhana recipes, snacking ideas and stories from the Fresh Mewa kitchen.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await listPublishedPosts();

  return (
    <main className="mx-auto max-w-5xl px-5 pb-16 pt-28 sm:px-8 lg:pt-32">
      <h1 className="font-poster text-5xl text-forest sm:text-6xl">Blog</h1>

      {posts.length === 0 ? (
        <p className="mt-6 text-ink-muted">No posts yet — check back soon.</p>
      ) : (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2">
          {posts.map((p) => (
            <li key={p.slug}>
              <PostCard post={p} sizes="(min-width: 640px) 30rem, 100vw" />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}