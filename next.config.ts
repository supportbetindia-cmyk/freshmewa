import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
        ],
      },
    ];
  },
  images: {
    qualities: [75, 80],
    formats: ["image/avif", "image/webp"],
  },
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
