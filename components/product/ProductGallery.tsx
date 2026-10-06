"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { AnimatePresence, m } from "framer-motion";
import { tones, type Flavour } from "@/lib/content";
import { ease } from "@/lib/motion";
import MakhanaPouch from "../MakhanaPouch";
import spicedBowl from "@/public/images/hero/makhana-bowl-spiced.webp";
import plainBowl from "@/public/images/hero/makhana-bowl.webp";
import loose from "@/public/images/hero/makhana-1.webp";
import pouchThumb from "@/public/images/hero/makhana-pouch.webp";

// ponytail: shared lifestyle shots for every flavour; swap in per-flavour photography when it exists.
const shots: { src: StaticImageData; alt: string; width: string }[] = [
  { src: spicedBowl, alt: "Bowl of seasoned roasted makhana", width: "w-[78%]" },
  { src: plainBowl, alt: "Bowl of roasted makhana, top view", width: "w-[64%]" },
  { src: loose, alt: "A single roasted makhana up close", width: "w-[46%]" },
];

/** Main stage (pouch first, then lifestyle shots) with crossfading slides and thumbnails. */
export default function ProductGallery({ flavour: f }: { flavour: Flavour }) {
  const [active, setActive] = useState(0);
  const t = tones[f.tone];
  const wordSize = `${Math.min(34, 96 / (f.short.length * 0.39))}cqw`;

  return (
    <div className="lg:sticky lg:top-24">
      <div className={`relative aspect-square overflow-hidden rounded-[2rem] @container ${t.soft}`}>
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(55%_55%_at_50%_50%,rgb(255_255_255/0.75),transparent_75%)]" />
        <span
          aria-hidden
          style={{ fontSize: wordSize }}
          className={`absolute inset-x-0 top-[8%] select-none whitespace-nowrap text-center font-poster uppercase leading-none opacity-[0.14] ${t.text}`}
        >
          {f.short}
        </span>

        <AnimatePresence mode="popLayout" initial={false}>
          <m.div
            key={active}
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.55, ease }}
            className="absolute inset-0 grid place-items-center"
          >
            {active === 0 ? (
              <MakhanaPouch flavour={f} priority sizes="(min-width: 1024px) 22vw, 50vw" className="w-[46%]" />
            ) : (
              <Image
                src={shots[active - 1].src}
                quality={90}
                alt={shots[active - 1].alt}
                sizes="(min-width: 1024px) 36vw, 80vw"
                className={`h-auto drop-shadow-[0_24px_24px_rgba(30,52,24,0.22)] ${shots[active - 1].width}`}
              />
            )}
          </m.div>
        </AnimatePresence>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-3" role="group" aria-label="Product images">
        {[{ src: pouchThumb, alt: `${f.name} pack` }, ...shots].map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show image ${i + 1}: ${s.alt}`}
            aria-pressed={active === i}
            className={`grid aspect-square place-items-center rounded-2xl p-2 ring-2 transition-[box-shadow,background-color] duration-300 ${
              active === i ? `${t.soft} ring-forest` : "bg-white/60 ring-transparent hover:ring-forest/20"
            }`}
          >
            <Image src={s.src} alt="" sizes="6rem" className="h-full w-auto object-contain" />
          </button>
        ))}
      </div>
    </div>
  );
}
