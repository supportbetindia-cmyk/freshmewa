"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sanitizeHtml from "sanitize-html";
import { requireAdmin } from "@/lib/auth/users";
import { createPost, deletePost, setPublished, updatePost, type PostInput } from "@/lib/db/posts";
import { slugify } from "@/lib/content";

export type PostFormState = { error?: string; success?: string; values?: PostInput } | null;

const allowedHtml: sanitizeHtml.IOptions = {
  allowedTags: ["h2", "h3", "h4", "p", "br", "strong", "em", "u", "s", "a", "ul", "ol", "li", "blockquote", "img", "hr", "code", "pre",
    "table", "thead", "tbody", "tr", "th", "td", "span", "mark"],
  allowedAttributes: {
    a: ["href"],
    img: ["src", "alt"],
    th: ["colspan", "rowspan", "style"],
    td: ["colspan", "rowspan", "style"],
    p: ["style"], h2: ["style"], h3: ["style"], h4: ["style"],
    span: ["style"],
    mark: ["style"],
  },
  allowedStyles: {
    "*": {
      "text-align": [/^(left|center|right|justify)$/],
      color: [/^#[0-9a-f]{3,8}$/i, /^rgba?\([\d\s.,%]+\)$/],
      "background-color": [/^#[0-9a-f]{3,8}$/i, /^rgba?\([\d\s.,%]+\)$/],
    },
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowProtocolRelative: false,
  transformTags: { h1: "h2", b: "strong", i: "em" }, // the page title is the only <h1>
  exclusiveFilter: (frame) => frame.tag === "img" && !frame.attribs.src,
};

const isImageLink = (s: string) => /^\/(?![/\\])\S+$/.test(s) || /^https:\/\/\S+$/.test(s);

function isDuplicate(err: unknown) {
  const e = err as { code?: string; cause?: { code?: string } };
  return (e.cause?.code ?? e.code) === "23505";
}

function refresh() {
  revalidatePath("/admin/blog", "layout");
  revalidatePath("/blog", "layout");
}

export async function savePost(_prev: PostFormState, formData: FormData): Promise<PostFormState> {
  await requireAdmin();

  const text = (name: string) => String(formData.get(name) ?? "").trim();
  const rawId = text("id");
  const id = rawId ? Number(rawId) : undefined;
  const intent = formData.get("intent");
  const values: PostInput = {
    title: text("title"),
    slug: slugify(text("slug") || text("title")),
    excerpt: text("excerpt"),
    seoTitle: text("seoTitle") || null,
    seoDescription: text("seoDescription") || null,
    coverImage: text("coverImage") || null,
    category: text("category").slice(0, 60) || null,
    seoKeywords: text("seoKeywords").slice(0, 300) || null,
    body: sanitizeHtml(text("body"), allowedHtml),
  };
  const hasText = sanitizeHtml(values.body, { allowedTags: [] }).trim() !== "";

  if (id !== undefined && !Number.isSafeInteger(id)) return { error: "Invalid post." };
  if (!values.title || !values.slug || !hasText) return { error: "Title and post text are required.", values };
  if (values.coverImage && !isImageLink(values.coverImage)) {
    return { error: "Cover image must be a site path like /images/blog/photo.jpg or an https:// link.", values };
  }

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
  if (!id) redirect(`/admin/blog/${postId}`);
  return { success: intent === "publish" ? "Published." : intent === "unpublish" ? "Moved back to drafts." : "Saved." };
}

export async function removePost(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (Number.isSafeInteger(id)) await deletePost(id);
  refresh();
  redirect("/admin/blog");
}