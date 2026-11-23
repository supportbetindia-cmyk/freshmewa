import Image from "next/image";

export default function CoverImage({ src, alt, sizes, priority = false, className = "" }: { src: string; alt: string; sizes: string; priority?: boolean; className?: string }) {
  return (
    <div className={`relative aspect-[1200/630] overflow-hidden bg-cream-deep ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} unoptimized={!src.startsWith("/")} className="object-cover" />
    </div>
  );
}
