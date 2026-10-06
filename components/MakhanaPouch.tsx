"use client";

import { useState } from "react";
import Image from "next/image";
import pouch from "@/public/images/hero/makhana-pouch.webp";
import { tones, type Flavour } from "@/lib/content";

/** Kraft pouch photo with a printed FreshMewa label (multiply = ink on paper). */
export default function MakhanaPouch({
  flavour,
  sizes,
  priority = false,
  className = "",
}: {
  flavour?: Flavour;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`relative @container ${className}`}>
      <Image
        src={pouch}
        onLoad={() => setLoaded(true)}
        alt={`Fresh Mewa ${flavour?.name ?? "roasted makhana"} pouch`}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className="h-auto w-full drop-shadow-[0_26px_26px_rgba(30,52,24,0.25)]"
        draggable={false}
      />
      <div
        aria-hidden
        className={`absolute inset-x-[14%] top-[72%] flex flex-col items-center text-center text-forest mix-blend-multiply transition-opacity duration-700 ${loaded ? "" : "opacity-0"}`}
      >
        <span className="font-poster text-[13cqw] leading-none tracking-[0.04em]">FRESHMEWA</span>
        <span
          className={`mt-[0.35em] font-poster text-[6.5cqw] leading-none tracking-[0.12em] ${flavour ? tones[flavour.tone].text : "text-gold"}`}
        >
          {(flavour?.short ?? "Roasted Makhana").toUpperCase()}
        </span>
        <span className="mt-[0.45em] text-[3cqw] font-semibold uppercase tracking-[0.2em] opacity-70">
          {flavour ? "Roasted Makhana" : "Made for every day"}
        </span>
      </div>
    </div>
  );
}
