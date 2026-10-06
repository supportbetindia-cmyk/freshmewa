import Image from "next/image";
import Reveal from "../ui/Reveal";
import { Ornament } from "../ui/Ornaments";
import chaiMakhana from "@/public/images/hero/chai-makhana.webp";
import handMakhana from "@/public/images/hero/hand-makhana.webp";

export default function Intro() {
  return (
    <section className="py-14 sm:py-16 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14">
        <Reveal>
          <h2 className="poster-h2 text-forest">
            You Know That <span className="text-gold">“Bas Kuch Crunchy Sa Ho”</span> Feeling?
          </h2>
          <p className="mt-4 font-display text-2xl italic text-gold sm:text-3xl">
            Yeah. That&apos;s exactly what we&apos;re here for.
          </p>
          <Image
            src={chaiMakhana}
            quality={90}
            alt="Two kulhads of chai with roasted makhana spilled beside them"
            sizes="(min-width: 1024px) 21rem, 65vw"
            className="mx-auto mt-5 h-auto w-[65%] max-w-[21rem] lg:mx-0"
          />
        </Reveal>

        {/* Right column: illustrated hand tossing makhana, overlapping the top of the card */}
        <div
          // --hand = illustration width; its height is ~0.94× that. Overlap the card by 1.25rem (inside its padding, never over text).
          style={{ "--hand": "clamp(10rem, 30vw, 16rem)" } as React.CSSProperties}
          className="relative pt-[calc(var(--hand)*0.94-1.25rem)]"
        >
          <Reveal delay={0.15} className="absolute right-0 top-0 z-10 w-[var(--hand)] sm:right-4">
            <Image
              src={handMakhana}
              quality={90}
              alt="Illustrated hand tossing a handful of roasted makhana"
              sizes="(min-width: 1024px) 16rem, 30vw"
              className="h-auto w-full -rotate-3 animate-[float_6s_ease-in-out_infinite] motion-reduce:animate-none"
            />
          </Reveal>
          <Reveal delay={0.1} className="relative rounded-[1.75rem] border border-forest/10 bg-white/50 p-6 sm:p-8">
            <p className="text-base leading-relaxed text-ink-muted sm:text-lg">
              Fresh Mewa makes roasted makhana for everyday snacking, the kind you keep nearby because you know
              you&apos;ll want a handful at some point.
            </p>
            <ul className="mt-5 space-y-1 font-poster text-3xl uppercase leading-tight text-forest sm:text-4xl">
              {["Good crunch.", "Great flavour.", "No overthinking."].map((line) => (
                <li key={line} className="flex items-center gap-3">
                  <Ornament glyph="z" className="text-lg text-gold" />
                  {line}
                </li>
              ))}
            </ul>
            <p className="mt-5 inline-block rounded-full bg-forest px-5 py-2.5 font-display text-lg italic text-cream">
              Just open. Grab a handful. Enjoy.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
