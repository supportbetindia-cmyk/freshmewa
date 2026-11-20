import type { MetadataRoute } from "next";
import { flavours, productPath, routes, siteUrl } from "@/lib/content";
import { listPublishedPosts } from "@/lib/db/posts";

export const revalidate = 3600; // new blog posts appear within an hour

/** /sitemap.xml — built from the same routes as the site's links, plus every published blog post. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["/", routes.shop, ...flavours.map((f) => productPath(f.slug)), routes.story, routes.shipping, "/blog"];
  const posts = await listPublishedPosts().catch(() => []); // database down → still serve the pages
  return [
    ...pages.map((p) => ({ url: siteUrl + p })),
    ...posts.map((p) => ({ url: `${siteUrl}/blog/${p.slug}`, lastModified: p.publishedAt ?? undefined })),
  ];
}
