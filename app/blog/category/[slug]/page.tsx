import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { listPublishedCategories, listPublishedPosts } from "@/lib/db/posts";
import PostCard from "../../PostCard";

export async function generateMetadata({ params }: PageProps<"/blog/category/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const cat = (await listPublishedCategories()).find((c) => c.slug === slug);
  if (!cat) return {};
  const title = `${cat.name} — Fresh Mewa Blog`;
  const description = `Fresh Mewa articles about ${cat.name.toLowerCase()}.`;
  return { title, description, alternates: { canonical: `/blog/category/${cat.slug}` }, openGraph: { title, description, url: `/blog/category/${cat.slug}` } };
}

export default async function CategoryPage({ params }: PageProps<"/blog/category/[slug]">) {
  const { slug } = await params;
  const cats = await listPublishedCategories();
  const cat = cats.find((c) => c.slug === slug);
  if (!cat) notFound();
  const posts = await listPublishedPosts(cat.name);

  return (
    <main className="mx-auto max-w-5xl px-5 pb-16 pt-28 sm:px-8 lg:pt-32">
      <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:underline"><ArrowLeft className="size-4" aria-hidden />All posts</Link>
      <h1 className="mt-3 font-poster text-5xl text-forest sm:text-6xl">{cat.name}</h1>
      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Categories">
        {cats.map((c) => (
          <li key={c.slug}>
            <Link href={`/blog/category/${c.slug}`} aria-current={c.slug === slug ? "page" : undefined}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${c.slug === slug ? "border-forest bg-forest text-cream" : "border-forest/20 text-forest hover:border-forest"}`}>
              {c.name} <span className="opacity-60">({c.count})</span>
            </Link>
          </li>
        ))}
      </ul>
      <ul className="mt-8 grid gap-5 sm:grid-cols-2">
        {posts.map((p) => (
          <li key={p.slug}><PostCard post={p} sizes="(min-width: 640px) 30rem, 100vw" /></li>
        ))}
      </ul>
    </main>
  );
}
