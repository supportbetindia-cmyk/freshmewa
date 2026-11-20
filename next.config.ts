import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 80], // 75 = photos, 80 = the hero (LCP) image
    formats: ["image/avif", "image/webp"], // AVIF where supported (smaller), WebP otherwise
  },
  // Old URLs → the SEO-report names (lib/content.ts `routes` / `productPath`). Permanent, so Google moves rankings over.
  async redirects() {
    return [
      { source: "/shop", destination: "/shop-dry-fruits", permanent: true },
      { source: "/shop/:slug(pudina|salt-pepper|peri-peri)", destination: "/shop/:slug-makhana", permanent: true },
      { source: "/our-story", destination: "/our-story-fresh-mewa", permanent: true },
      { source: "/shipping-returns", destination: "/shipping-returns-policy", permanent: true },
    ];
  },
};

export default nextConfig;
