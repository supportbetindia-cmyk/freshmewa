import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/db/posts";
import PostForm from "../PostForm";

export default async function EditPost({ params }: PageProps<"/admin/blog/[id]">) {
  const id = Number((await params).id);
  const post = Number.isSafeInteger(id) ? await getPost(id) : undefined; // "/admin/blog/abc" → 404, not a database error
  if (!post) notFound();

  return (
    <>
      <Link href="/admin/blog" className="text-sm font-semibold text-forest hover:underline">← All posts</Link>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-poster text-4xl text-forest">{post.title}</h1>
        {post.publishedAt && (
          <Link href={`/blog/${post.slug}`} target="_blank" className="text-sm font-semibold text-forest underline">View on site ↗</Link>
        )}
      </div>
      <div className="mt-5"><PostForm key={post.id} post={post} /></div>
    </>
  );
}
