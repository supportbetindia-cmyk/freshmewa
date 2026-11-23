"use client";

import { useActionState, useState } from "react";
import { removePost, savePost } from "./actions";
import RichEditor from "./RichEditor";
import SeoFields, { field } from "./SeoFields";

type Post = { id: number; slug: string; title: string; excerpt: string; seoTitle: string | null; seoDescription: string | null; seoKeywords: string | null; category: string | null; coverImage: string | null; body: string; publishedAt: Date | null };

const label = "block text-sm font-semibold text-forest";
const hint = "font-normal text-ink-muted";

export default function PostForm({ post, categories }: { post?: Post; categories: string[] }) {
  const [state, action, pending] = useActionState(savePost, null);
  const v = state?.values ?? post;
  const live = Boolean(post?.publishedAt);

  return (
    <form action={action} className="space-y-4 rounded-2xl border border-forest/10 bg-white p-5">
      {post && <input type="hidden" name="id" value={post.id} />}

      <label className={label}>
        Title
        <input name="title" required defaultValue={v?.title} className={field} />
      </label>

      <label className={label}>
        URL <span className={hint}>/blog/… (leave empty to make it from the title)</span>
        <input name="slug" defaultValue={v?.slug} placeholder="why-makhana-is-a-superfood" className={field} />
      </label>

      <label className={label}>
        Short summary <span className={hint}>shown on the blog list and in Google</span>
        <textarea name="excerpt" rows={2} defaultValue={v?.excerpt} className={field} />
      </label>

      <label className={label}>
        Category <span className={hint}>— optional, one per post. Pick an existing one or type a new one</span>
        <input name="category" list="blog-categories" maxLength={60} defaultValue={v?.category ?? ""} placeholder="Recipes" className={field} />
        <datalist id="blog-categories">{categories.map((c) => <option key={c} value={c} />)}</datalist>
      </label>

      <CoverField initial={v?.coverImage} />

      <SeoFields seoTitle={v?.seoTitle} seoDescription={v?.seoDescription} seoKeywords={v?.seoKeywords} slug={v?.slug} />

      <div className={label}>
        Post <span className={hint}>paste from Google Docs, Word or a website — formatting comes along</span>
        <RichEditor name="body" initial={post?.body} />
      </div>

      {state?.error && <p role="alert" className="text-sm font-medium text-chilli">{state.error}</p>}
      {state?.success && <p role="status" className="text-sm text-forest">{state.success}</p>}

      <div className="flex flex-wrap gap-2">
        <button name="intent" value="save" disabled={pending} className="btn btn-primary disabled:opacity-60">
          {pending ? "Saving…" : live ? "Save" : "Save draft"}
        </button>
        <button name="intent" value={live ? "unpublish" : "publish"} disabled={pending} className="btn btn-outline disabled:opacity-60">
          {live ? "Unpublish" : "Publish"}
        </button>
        {post && (
          <button
            formAction={removePost}
            formNoValidate
            disabled={pending}
            onClick={(e) => { if (!confirm("Delete this post? This can't be undone.")) e.preventDefault(); }}
            className="ml-auto rounded-full px-4 text-sm font-semibold text-chilli hover:underline disabled:opacity-60"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
function CoverField({ initial }: { initial?: string | null }) {
  const [src, setSrc] = useState(initial ?? "");
  return (
    <label className={label}>
      Cover image <span className={hint}>— a site path like /images/blog/photo.jpg, or an https:// link (optional)</span>
      <div className="mt-1.5 flex flex-wrap gap-2">
        <input name="coverImage" value={src} onChange={(e) => setSrc(e.target.value.trim())} placeholder="/images/blog/makhana-recipes.jpg" className={`${field} mt-0 flex-1`} />
        <label className="btn btn-outline h-12 cursor-pointer bg-white text-forest">
          Upload
          <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            const body = new FormData();
            body.append("file", file);
            const res = await fetch("/api/admin/blog-images", { method: "POST", body });
            const data = await res.json().catch(() => ({}));
            if (res.ok) setSrc(data.url); else alert(data.error ?? "Upload failed.");
          }} />
        </label>
      </div>
      {src && (
        // eslint-disable-next-line @next/next/no-img-element -- admin-only preview of whatever link was typed
        <img src={src} alt="" className="mt-2 aspect-[1200/630] w-full max-w-sm rounded-xl bg-cream object-cover" />
      )}
    </label>
  );
}
