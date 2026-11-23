import JsonLd from "@/components/JsonLd";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import MakhanaPouch from "@/components/MakhanaPouch";
import { flavours, formatDate, formatINR, packs, productPath, routes, siteUrl, slugify } from "@/lib/content";
import { getPublishedPost, listPublishedPosts } from "@/lib/db/posts";
import CoverImage from "../CoverImage";
import PostCard from "../PostCard";

const getPost = cache(getPublishedPost);

export function generateStaticParams() {
  return [];
}

const readingMinutes = (html: string) => Math.max(1, Math.round(html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length / 200));

const shareImage = (cover: string | null) => (cover ? (cover.startsWith("/") ? siteUrl + cover : cover) : `${siteUrl}/opengraph-image.jpg`);

function addHeadingIds(html: string) {
  const toc: { id: string; label: string; level: string }[] = [];
  const body = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_, level: string, inner: string) => {
    const label = inner.replace(/<[^>]+>/g, "");
    let id = slugify(label) || "section";
    if (toc.some((t) => t.id === id)) id += `-${toc.length}`;
    toc.push({ id, label, level });
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });
  return { body, toc };
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  const description = post.seoDescription || post.excerpt || undefined;
  return {
    title: post.seoTitle || `${post.title} — Fresh Mewa`,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    keywords: post.seoKeywords ? post.seoKeywords.split(",").map((k) => k.trim()).filter(Boolean) : undefined,
    openGraph: {
      type: "article",
      title: post.seoTitle || post.title,
      description,
      url: `/blog/${post.slug}`,
      siteName: "Fresh Mewa",
      publishedTime: post.publishedAt!.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      images: shareImage(post.coverImage),
    },
  };
}

export default async function BlogPost({ params }: PageProps<"/blog/[slug]">) {
  const post = await getPost((await params).slug);
  if (!post) notFound();

  const { body, toc } = addHeadingIds(post.body);
  const related = (await listPublishedPosts()).filter((p) => p.slug !== post.slug).slice(0, 3);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image: shareImage(post.coverImage),
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    datePublished: post.publishedAt!.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Organization", name: "Fresh Mewa", url: siteUrl },
    publisher: { "@type": "Organization", name: "Fresh Mewa", logo: { "@type": "ImageObject", url: `${siteUrl}/images/logo.webp` } },
  };

  return (
    <main className="mx-auto max-w-7xl px-5 pb-16 pt-28 sm:px-8 lg:grid lg:grid-cols-[12rem_minmax(0,1fr)_16rem] lg:gap-10 lg:pt-32 xl:gap-14">
      <JsonLd data={jsonLd} />

      <aside className="max-lg:hidden">
        {toc.length > 1 && (
          <nav aria-label="On this page" className="sticky top-28">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">On this page</p>
            <ul className="mt-3 space-y-2 border-l border-forest/15 text-sm">
              {toc.map((t) => (
                <li key={t.id} className={t.level === "3" ? "pl-6" : "pl-3"}>
                  <a href={`#${t.id}`} className="block text-ink-muted hover:text-forest" dangerouslySetInnerHTML={{ __html: t.label }} />
                </li>
              ))}
            </ul>
          </nav>
        )}
      </aside>

      <div>
        <Link href="/blog" className="text-sm font-semibold text-forest hover:underline">← All posts</Link>
        <h1 className="mt-4 font-display text-4xl leading-tight text-forest sm:text-5xl">{post.title}</h1>
        <p className="mt-3 text-ink-muted">
          <time dateTime={post.publishedAt!.toISOString()}>{formatDate(post.publishedAt!)}</time> · {readingMinutes(post.body)} min read
        </p>
        {post.category && (
          <Link href={`/blog/category/${slugify(post.category)}`} className="mt-3 inline-block rounded-full bg-cream-deep px-3 py-1 text-sm font-semibold text-forest hover:bg-gold-soft/40">
            {post.category}
          </Link>
        )}
        {post.coverImage && <CoverImage src={post.coverImage} alt={post.title} priority sizes="(min-width: 1024px) 42rem, 100vw" className="mt-6 rounded-[1.75rem]" />}
        <article className="blog-content mt-8 text-lg" dangerouslySetInnerHTML={{ __html: body }} />

        {related.length > 0 && (
          <section aria-labelledby="more-posts" className="mt-14 border-t border-forest/10 pt-8">
            <h2 id="more-posts" className="font-poster text-3xl text-forest">More from the blog</h2>
            <ul className="mt-5 grid gap-5 sm:grid-cols-2">
              {related.map((p) => (
                <li key={p.slug}><PostCard post={p} sizes="(min-width: 640px) 21rem, 100vw" /></li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <aside className="mt-12 lg:mt-0">
        <div className="rounded-[1.75rem] border border-forest/10 bg-white p-5 lg:sticky lg:top-28">
          <p className="font-poster text-2xl text-forest">Our flavours</p>
          <ul className="mt-3 space-y-1">
            {flavours.map((f) => (
              <li key={f.slug}>
                <Link href={productPath(f.slug)} className="flex items-center gap-3 rounded-2xl p-2 hover:bg-cream-deep/50">
                  <div className="w-12 shrink-0"><MakhanaPouch flavour={f} sizes="3rem" /></div>
                  <span>
                    <span className="block font-semibold leading-tight text-forest">{f.name}</span>
                    <span className="text-sm text-ink-muted">from {formatINR(packs[0].price)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href={routes.shop} className="btn btn-primary mt-4 w-full">Shop now</Link>
        </div>
      </aside>
    </main>
  );
}