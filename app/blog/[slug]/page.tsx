import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import MakhanaPouch from "@/components/MakhanaPouch";
import { flavours, formatDate, formatINR, packs } from "@/lib/content";
import { getPublishedPost } from "@/lib/db/posts";

/** generateMetadata and the page both need the post — cache() makes that one database query, not two. */
const getPost = cache(getPublishedPost);

/** Empty list = build no posts ahead of time; each one is built on its first visit, then served as static HTML. */
export function generateStaticParams() {
  return [];
}

/** Gives every <h2>/<h3> an id, and returns them as a table of contents. */
function addHeadingIds(html: string) {
  const toc: { id: string; label: string; level: string }[] = [];
  const body = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_, level: string, inner: string) => {
    const label = inner.replace(/<[^>]+>/g, ""); // "<strong>TL;DR</strong>" → "TL;DR"
    let id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "section";
    if (toc.some((t) => t.id === id)) id += `-${toc.length}`; // two headings with the same text
    toc.push({ id, label, level });
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });
  return { body, toc };
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  return {
    title: `${post.title} — Fresh Mewa`,
    description: post.excerpt || undefined,
    openGraph: { type: "article", title: post.title, description: post.excerpt || undefined, publishedTime: post.publishedAt!.toISOString() },
  };
}

export default async function BlogPost({ params }: PageProps<"/blog/[slug]">) {
  const post = await getPost((await params).slug);
  if (!post) notFound(); // missing, or still a draft

  const { body, toc } = addHeadingIds(post.body);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt!.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Organization", name: "Fresh Mewa" },
  };

  return (
    <main className="mx-auto max-w-7xl px-5 pb-16 pt-28 sm:px-8 lg:grid lg:grid-cols-[12rem_minmax(0,1fr)_16rem] lg:gap-10 lg:pt-32 xl:gap-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      {/* Left: table of contents (wide screens only) */}
      <aside className="max-lg:hidden">
        {toc.length > 1 && (
          <nav aria-label="On this page" className="sticky top-28">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">On this page</p>
            <ul className="mt-3 space-y-2 border-l border-forest/15 text-sm">
              {toc.map((t) => (
                <li key={t.id} className={t.level === "3" ? "pl-6" : "pl-3"}>
                  {/* label is already-cleaned post HTML text, so &amp; etc. display correctly */}
                  <a href={`#${t.id}`} className="block text-ink-muted hover:text-forest" dangerouslySetInnerHTML={{ __html: t.label }} />
                </li>
              ))}
            </ul>
          </nav>
        )}
      </aside>

      {/* Middle: the post */}
      <div>
        <Link href="/blog" className="text-sm font-semibold text-forest hover:underline">← All posts</Link>
        <h1 className="mt-4 font-display text-4xl leading-tight text-forest sm:text-5xl">{post.title}</h1>
        <time dateTime={post.publishedAt!.toISOString()} className="mt-3 block text-ink-muted">{formatDate(post.publishedAt!)}</time>
        {/* Safe only because savePost cleans the HTML with sanitize-html before saving */}
        <article className="blog-content mt-8 text-lg" dangerouslySetInnerHTML={{ __html: body }} />
      </div>

      {/* Right: flavours (under the post on phones) */}
      <aside className="mt-12 lg:mt-0">
        <div className="rounded-[1.75rem] border border-forest/10 bg-white p-5 lg:sticky lg:top-28">
          <p className="font-poster text-2xl text-forest">Our flavours</p>
          <ul className="mt-3 space-y-1">
            {flavours.map((f) => (
              <li key={f.slug}>
                <Link href={`/shop/${f.slug}`} className="flex items-center gap-3 rounded-2xl p-2 hover:bg-cream-deep/50">
                  <div className="w-12 shrink-0"><MakhanaPouch flavour={f} sizes="3rem" /></div>
                  <span>
                    <span className="block font-semibold leading-tight text-forest">{f.name}</span>
                    <span className="text-sm text-ink-muted">from {formatINR(packs[0].price)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/shop" className="btn btn-primary mt-4 w-full">Shop now</Link>
        </div>
      </aside>
    </main>
  );
}