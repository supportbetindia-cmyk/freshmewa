"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sanitizeHtml from "sanitize-html"; // NEW
import { requireAdmin } from "@/lib/auth/admin";
import { createPost, deletePost, setPublished, updatePost, type PostInput } from "@/lib/db/posts";

export type PostFormState = { error?: string; success?: string; values?: PostInput } | null;

// NEW — only these tags/attributes survive. Scripts, styles, onclick=, javascript: links, pasted base64 images are removed.
const allowedHtml: sanitizeHtml.IOptions = {
  allowedTags: ["h2", "h3", "h4", "p", "br", "strong", "em", "u", "s", "a", "ul", "ol", "li", "blockquote", "img", "hr", "code", "pre"],
  allowedAttributes: { a: ["href"], img: ["src", "alt"] },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: { h1: "h2", b: "strong", i: "em" }, // the page title is the only <h1>
  exclusiveFilter: (frame) => frame.tag === "img" && !frame.attribs.src,
};

/** "Why Makhana? A Superfood!" → "why-makhana-a-superfood" */
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/** Postgres error 23505 = unique rule broken (slug already used). Drizzle puts the driver's error in `.cause`. */
function isDuplicate(err: unknown) {
  const e = err as { code?: string; cause?: { code?: string } };
  return (e.cause?.code ?? e.code) === "23505";
}

function refresh() {
  revalidatePath("/admin/blog", "layout");
  revalidatePath("/blog", "layout"); // the public pages (step 4)
}

export async function savePost(_prev: PostFormState, formData: FormData): Promise<PostFormState> {
  await requireAdmin(); // before the try below: its redirect works by throwing, and catch would swallow it

  const text = (name: string) => String(formData.get(name) ?? "").trim();
  const rawId = text("id");
  const id = rawId ? Number(rawId) : undefined; // no id = new post
  const intent = formData.get("intent"); // which button was clicked: "save" | "publish" | "unpublish"
  const values: PostInput = {
    title: text("title"),
    slug: slugify(text("slug") || text("title")), // empty URL field → made from the title
    excerpt: text("excerpt"),
    body: sanitizeHtml(text("body"), allowedHtml), // NEW
  };
  const hasText = sanitizeHtml(values.body, { allowedTags: [] }).trim() !== ""; // NEW — "<p></p>" counts as empty

  if (id !== undefined && !Number.isSafeInteger(id)) return { error: "Invalid post." };
  if (!values.title || !values.slug || !hasText) return { error: "Title and post text are required.", values };

  let postId = id;
  try {
    if (id) {
      if (!(await updatePost(id, values))) return { error: "This post no longer exists." };
    } else {
      postId = (await createPost(values)).id;
    }
    if (intent === "publish" || intent === "unpublish") await setPublished(postId!, intent === "publish");
  } catch (err) {
    if (isDuplicate(err)) return { error: `/blog/${values.slug} is already used by another post. Change the URL.`, values };
    console.error("savePost failed", err);
    return { error: "Couldn't save the post. Please try again.", values };
  }

  refresh();
  if (!id) redirect(`/admin/blog/${postId}`); // new post → go to its edit page
  return { success: intent === "publish" ? "Published." : intent === "unpublish" ? "Moved back to drafts." : "Saved." };
}

export async function removePost(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (Number.isSafeInteger(id)) await deletePost(id);
  refresh();
  redirect("/admin/blog");
}