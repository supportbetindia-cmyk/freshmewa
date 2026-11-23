import Link from "next/link";
import PostForm from "../PostForm";
import { listAllCategoryNames } from "@/lib/db/posts";

export default async function NewPost() {
  const categories = await listAllCategoryNames();
  return (
    <>
      <Link href="/admin/blog" className="text-sm font-semibold text-forest hover:underline">← All posts</Link>
      <h1 className="mt-3 font-poster text-4xl text-forest">New post</h1>
      <div className="mt-5"><PostForm categories={categories} /></div>
    </>
  );
}
