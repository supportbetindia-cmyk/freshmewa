"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { m, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ease, reveal, useDepth, useMouseParallax } from "@/lib/motion";
import spicedBowl from "@/public/images/hero/makhana-bowl-spiced.webp";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const mouse = useMouseParallax();
  const reduced = useReducedMotion();
  const k = reduced ? 0 : 1;

  // Scroll-linked parallax while the hero leaves the viewport (no pinning → no dead scroll).
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const titleY = useTransform(p, [0, 1], [0, 140 * k]);
  const artY = useTransform(p, [0, 1], [0, -80 * k]);
  const artScale = useTransform(p, [0, 1], [1, 1 + 0.08 * k]);
  const copyY = useTransform(p, [0, 1], [0, -60 * k]);
  const bgY = useTransform(p, [0, 1], [0, 160 * k]);
  const titleMouseX = useDepth(mouse.x, -12);
  const titleMouseY = useDepth(mouse.y, -8);

  return (
    <section
      ref={ref}
      aria-label="Fresh Mewa roasted makhana"
      className="relative overflow-hidden lg:h-svh lg:min-h-[680px] "
    >
      {/* ── Background ─────────────────────────────── */}
      <m.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease }}
        style={{ y: bgY }}
        className="grain absolute inset-0 will-change-transform"
      >
        <div className="absolute inset-0 bg-[radial-gradient(45%_45%_at_50%_70%,var(--color-gold-soft)_0%,transparent_75%)] opacity-55" />
        <div className="absolute inset-0 bg-[radial-gradient(40%_40%_at_0%_100%,var(--color-pista-soft)_0%,transparent_70%)] opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(35%_35%_at_100%_0%,var(--color-pista-soft)_0%,transparent_70%)] opacity-40" />
      </m.div>

      <div className="relative mx-auto flex h-full max-w-[1440px] flex-col items-center px-5 pb-10 pt-28 sm:px-8 lg:pb-0 lg:pt-[6.5rem]">
        {/* ── Poster headline ─────────────────────── */}
        <m.div style={{ y: titleY }} className="relative z-0 w-full text-center">
          <m.div style={{ x: titleMouseX, y: titleMouseY }}>
            <h1 className="font-poster font-normal uppercase leading-[0.86] text-forest">
              {["Roasted", "Makhana,"].map((word, wi) => (
                <span
                  key={word}
                  aria-hidden
                  className="block whitespace-nowrap text-[26vw] lg:inline lg:text-[min(13.4vw,25svh)]"
                >
                  {/* Clip box padded by 0.15em (negative margin keeps the layout): Veneer's glyphs are taller than the
                      0.86 line, and Safari clipped their tops. Letters start at 135% so they're fully hidden below it. */}
                  {word.split("").map((ch, i) => (
                    <span key={i} className="-my-[0.15em] inline-block overflow-hidden py-[0.15em] align-top">
                      <m.span
                        className="inline-block"
                        initial={{ y: "135%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1.05, ease, delay: 0.3 + wi * 0.25 + i * 0.04 }}
                      >
                        {ch}
                      </m.span>
                    </span>
                  ))}
                  {wi === 0 && <span className="hidden lg:inline"> </span>}
                </span>
              ))}
              <span className="sr-only">Roasted Makhana, Made for Every Day.</span>
            </h1>
          </m.div>
        </m.div>

        {/* ── Hero product: one bowl, centred, overlapping the lower part of the headline ── */}
        <m.div
          style={{ scale: artScale, y: artY }}
          className="relative z-10 -mt-[10%] w-full max-w-[min(28rem,36svh)] flex-none lg:absolute lg:bottom-[5svh] lg:left-1/2 lg:mt-0 lg:w-[min(50vw,760px,78svh)] lg:max-w-none lg:-translate-x-1/2"
        >
          <HeroBowl mx={mouse.x} my={mouse.y} />
        </m.div>

        {/* ── Copy: stacked on mobile, flanking the products on desktop ── */}
        <m.div
          style={{ y: copyY }}
          className="relative z-20 mt-4 grid w-full gap-5 text-center lg:pointer-events-none lg:absolute lg:inset-x-8 lg:bottom-12 lg:mt-0 lg:w-auto lg:grid-cols-[minmax(0,24rem)_1fr_minmax(0,19rem)] lg:items-end lg:text-left"
        >
          <m.div variants={reveal} initial="hidden" animate="show" custom={0.9} className="lg:pointer-events-auto">
            <p aria-hidden className="font-display text-[2rem] italic leading-none text-gold sm:text-[2.5rem] lg:whitespace-nowrap">
              Made for Every Day.
            </p>
            <p className="mx-auto mt-3 max-w-sm text-[0.95rem] leading-relaxed text-ink lg:mx-0">
              Crunchy, flavourful and made for those moments when you just want something good to snack on.
            </p>
            <div className="mt-5 flex justify-center gap-2 max-sm:[&_.btn]:h-11 max-sm:[&_.btn]:px-4 max-sm:[&_.btn]:text-[0.9rem] lg:justify-start">
              <Link href="/shop" className="group btn btn-primary pr-2">
                Shop the Crunch
                <span className="grid size-9 place-items-center rounded-full bg-gold-soft text-forest transition-transform duration-500 ease-premium group-hover:-rotate-45">
                  <ArrowRight className="size-4" />
                </span>
              </Link>
              <Link href="/our-story" className="btn btn-outline text-forest hover:bg-[#1e3418] hover:text-white">
                Meet Fresh Mewa
              </Link>
            </div>
          </m.div>

          <span className="max-lg:hidden" />

          <m.p
            variants={reveal}
            initial="hidden"
            animate="show"
            custom={1.05}
            className="mx-auto max-w-sm text-[0.95rem] leading-relaxed text-ink-muted lg:pointer-events-auto lg:mx-0 lg:border-l lg:border-gold/40 lg:pl-5"
          >
            From your desk to your chai break, from travel plans to movie nights, Fresh Mewa brings roasted makhana into the little moments that make up your day.
          </m.p>
        </m.div>
      </div>
    </section>
  );
}

type Mouse = { mx: MotionValue<number>; my: MotionValue<number> };

function HeroBowl({ mx, my }: Mouse) {
  const x = useDepth(mx, 22);
  const y = useDepth(my, 16);
  const rotate = useTransform(mx, (v) => v * 2);

  return (
    <m.div style={{ x, y, rotate }} className="will-change-transform">
      <m.div
        initial={{ opacity: 0, y: 90, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.3, ease, delay: 0.55 }}
      >
        <m.div
          className="group relative"
          whileHover={{ scale: 1.03, rotate: -1.5 }}
          transition={{ type: "spring", stiffness: 180, damping: 18 }}
        >
          <div
            aria-hidden
            className="absolute inset-[10%] -z-10 rounded-full bg-gold-soft opacity-40 blur-3xl transition-opacity duration-700 group-hover:opacity-80"
          />
          <Image
            src={spicedBowl}
            quality={90}
            alt="Bowl of seasoned roasted makhana"
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 1024px) 50vw, 90vw"
            className="h-auto w-full drop-shadow-[0_30px_30px_rgba(30,52,24,0.25)]"
            draggable={false}
          />
        </m.div>
      </m.div>
    </m.div>
  );
}
