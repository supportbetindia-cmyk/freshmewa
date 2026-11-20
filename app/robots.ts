import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/content";

/** /robots.txt — private pages stay out of search (they need a login anyway). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/account", "/checkout", "/login", "/admin", "/api/"] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
