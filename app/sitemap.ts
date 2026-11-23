import type { MetadataRoute } from "next";
import { flavours, productPath, routes, siteUrl } from "@/lib/content";
import { listPublishedPosts } from "@/lib/db/posts";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["/", routes.shop, ...flavours.map((f) => productPath(f.slug)), routes.story, routes.shipping, "/blog"];
  const posts = await listPublishedPosts().catch(() => []);
  return [
    ...pages.map((p) => ({ url: siteUrl + p })),
    ...posts.map((p) => ({ url: `${siteUrl}/blog/${p.slug}`, lastModified: p.publishedAt ?? undefined })),
  ];
}
