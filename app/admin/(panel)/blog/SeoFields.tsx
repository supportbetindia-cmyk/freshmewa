"use client";

import { useState } from "react";

export const field = "mt-1.5 w-full rounded-xl border border-forest/20 bg-white px-4 py-3 font-normal text-ink outline-none focus:border-forest focus:ring-4 focus:ring-gold-soft/50";

const LIMITS = { title: 60, description: 160 };

function Count({ n, max }: { n: number; max: number }) {
  return <span className={`float-right font-normal tabular-nums ${n > max ? "text-chilli" : "text-ink-muted"}`}>{n}/{max}</span>;
}

export default function SeoFields({ seoTitle, seoDescription, seoKeywords, slug }: { seoTitle?: string | null; seoDescription?: string | null; seoKeywords?: string | null; slug?: string }) {
  const [title, setTitle] = useState(seoTitle ?? "");
  const [description, setDescription] = useState(seoDescription ?? "");

  return (
    <fieldset className="space-y-4 rounded-xl border border-forest/10 bg-cream/60 p-4">
      <legend className="px-1 text-sm font-semibold text-forest">Google (SEO)</legend>

      <label className="block text-sm font-semibold text-forest">
        SEO title <span className="font-normal text-ink-muted">— empty = uses the post title</span>
        <Count n={title.length} max={LIMITS.title} />
        <input name="seoTitle" value={title} onChange={(e) => setTitle(e.target.value)} className={field} />
      </label>

      <label className="block text-sm font-semibold text-forest">
        SEO description <span className="font-normal text-ink-muted">— empty = uses the short summary</span>
        <Count n={description.length} max={LIMITS.description} />
        <textarea name="seoDescription" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className={field} />
      </label>

      <label className="block text-sm font-semibold text-forest">
        Keywords <span className="font-normal text-ink-muted">— comma-separated, e.g. roasted makhana, peri peri snack. Google ignores these; some other search tools still read them</span>
        <input name="seoKeywords" defaultValue={seoKeywords ?? ""} maxLength={300} className={field} />
      </label>

      <div aria-label="Google preview" className="rounded-xl bg-white p-4 font-sans">
        <p className="text-xs text-ink-muted">Preview in Google</p>
        <p className="mt-1 truncate text-sm text-[#202124]">bestfreshmewa.com › blog › {slug || "your-post-url"}</p>
        <p className="truncate text-lg text-[#1a0dab]">{title || <span className="text-ink-muted">(the post title)</span>}</p>
        <p className="line-clamp-2 text-sm text-[#4d5156]">{description || <span className="text-ink-muted">(the short summary)</span>}</p>
      </div>
    </fieldset>
  );
}
