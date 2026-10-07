import type { Metadata } from "next";
import Link from "next/link";
import { listPublishedPosts } from "@/lib/db/posts";
import { formatDate } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog — Fresh Mewa",
  description: "Makhana recipes, snacking ideas and stories from the Fresh Mewa kitchen.",
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
              <Link
                href={`/blog/${p.slug}`}
                className="block h-full rounded-[1.75rem] border border-forest/10 bg-white p-6 transition hover:-translate-y-0.5 hover:border-forest/30"
              >
                <time dateTime={p.publishedAt!.toISOString()} className="text-sm text-ink-muted">
                  {formatDate(p.publishedAt!)}
                </time>
                <h2 className="mt-2 font-display text-2xl leading-snug text-forest">{p.title}</h2>
                {p.excerpt && <p className="mt-2 leading-relaxed text-ink-muted">{p.excerpt}</p>}
                <span className="mt-4 inline-block text-sm font-semibold text-forest">Read more →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}