import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 80], // 75 = photos, 80 = the hero (LCP) image
    formats: ["image/avif", "image/webp"], // AVIF where supported (smaller), WebP otherwise
  },
};

export default nextConfig;
