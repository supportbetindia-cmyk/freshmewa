import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/content";
import CoverImage from "./CoverImage";

type Card = { slug: string; title: string; excerpt: string; coverImage: string | null; publishedAt: Date | null };

export default function PostCard({ post: p, sizes }: { post: Card; sizes: string }) {
  return (
    <Link
      href={`/blog/${p.slug}`}
      className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-forest/10 bg-white transition hover:-translate-y-0.5 hover:border-forest/30"
    >
      {p.coverImage && <CoverImage src={p.coverImage} alt="" sizes={sizes} />}
      <div className="flex flex-1 flex-col p-6">
        <time dateTime={p.publishedAt!.toISOString()} className="text-sm text-ink-muted">
          {formatDate(p.publishedAt!)}
        </time>
        <h2 className="mt-2 font-display text-2xl leading-snug text-forest">{p.title}</h2>
        {p.excerpt && <p className="mt-2 leading-relaxed text-ink-muted">{p.excerpt}</p>}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-forest">Read more<ArrowRight className="size-4" aria-hidden /></span>
      </div>
    </Link>
  );
}
