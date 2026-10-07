"use client";

import { useActionState } from "react";
import { removePost, savePost } from "./actions";
import RichEditor from "./RichEditor";

type Post = { id: number; slug: string; title: string; excerpt: string; body: string; publishedAt: Date | null };

const label = "block text-sm font-semibold text-forest";
const hint = "font-normal text-ink-muted";
const field = "mt-1.5 w-full rounded-xl border border-forest/20 bg-white px-4 py-3 font-normal text-ink outline-none focus:border-forest focus:ring-4 focus:ring-gold-soft/50";

export default function PostForm({ post }: { post?: Post }) {
  const [state, action, pending] = useActionState(savePost, null);
  const v = state?.values ?? post; // after an error, show what was typed, not the saved version
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