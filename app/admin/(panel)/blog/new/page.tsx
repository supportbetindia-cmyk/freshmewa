import Link from "next/link";
import PostForm from "../PostForm";

export default function NewPost() {
  return (
    <>
      <Link href="/admin/blog" className="text-sm font-semibold text-forest hover:underline">← All posts</Link>
      <h1 className="mt-3 font-poster text-4xl text-forest">New post</h1>
      <div className="mt-5"><PostForm /></div>
    </>
  );
}
