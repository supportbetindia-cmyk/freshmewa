import Link from "next/link";
import { listAllPosts } from "@/lib/db/posts";

export default async function AdminBlog() {
  const rows = await listAllPosts();

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-poster text-4xl text-forest">Blog</h1>
        <Link href="/admin/blog/new" className="btn btn-primary">New post</Link>
      </div>

      {rows.length === 0 ? (
        <p className="mt-6 text-ink-muted">No posts yet.</p>
      ) : (
        <ul className="mt-6 divide-y divide-forest/10 rounded-2xl border border-forest/10 bg-white">
          {rows.map((p) => (
            <li key={p.id}>
              <Link href={`/admin/blog/${p.id}`} className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-cream-deep/40">
                <span>
                  <span className="font-semibold text-forest">{p.title}</span>
                  <span className="block text-sm text-ink-muted">/blog/{p.slug}</span>
                </span>
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${p.publishedAt ? "bg-forest text-cream" : "bg-cream-deep text-ink-muted"}`}>
                  {p.publishedAt ? "Published" : "Draft"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
