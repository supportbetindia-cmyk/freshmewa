import Image from "next/image";
import type { Flavour } from "@/lib/content";
import { productImage } from "@/lib/product-images";

/** Branded jar photography shared by product cards and promotional sections. */
export default function MakhanaPouch({
  flavour, sizes, priority = false, className = "",
}: {
  flavour?: Flavour;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src={productImage(flavour?.slug)}
        alt={`Fresh Mewa ${flavour?.name ?? "Salt & Pepper Makhana"} jar`}
        sizes={sizes}
        quality={90}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className="h-auto w-full drop-shadow-[0_26px_26px_rgba(30,52,24,0.25)]"
        draggable={false}
      />
    </div>
  );
}
