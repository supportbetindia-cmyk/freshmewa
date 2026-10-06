import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { navLinks } from "@/lib/content";
import { Ornament } from "../ui/Ornaments";
import m1 from "@/public/images/hero/makhana-1.webp";
import m3 from "@/public/images/hero/makhana-3.webp";
import m5 from "@/public/images/hero/makhana-5.webp";
import spicedBowl from "@/public/images/hero/makhana-bowl-spiced.webp";
import logo from "@/public/images/logo.webp";

/*
 * Top edge = a "smile": cubic Bézier M0,0 C360,100 1080,100 1440,0 (viewBox 1440×100), footer green below it.
 * Points on that curve (as % of the curve box), used to rest makhana on it:
 * t=.12 → (10, 32) · t=.3 → (28, 63) · t=.42 → (41, 73) · t=.58 → (59, 73) · t=.7 → (72, 63) · t=.88 → (90, 32)
 */
const pieces: { src: StaticImageData; x: number; y: number; size: string; rotate: number; desktopOnly?: boolean }[] = [
  { src: m1, x: 10, y: 32, size: "w-9 sm:w-12", rotate: 14, desktopOnly: true },
  { src: m5, x: 28, y: 63, size: "w-10 sm:w-14", rotate: -18 },
  { src: m3, x: 36, y: 70, size: "w-8 sm:w-11", rotate: 35, desktopOnly: true },
  { src: m1, x: 64, y: 70, size: "w-8 sm:w-11", rotate: -32, desktopOnly: true },
  { src: m3, x: 72, y: 63, size: "w-10 sm:w-14", rotate: 22 },
  { src: m5, x: 90, y: 32, size: "w-9 sm:w-12", rotate: -10, desktopOnly: true },
];

export default function Footer() {
  return (
    <footer
      style={{ "--curve": "clamp(2.5rem, 6vw, 6rem)" } as React.CSSProperties}
      className="relative text-cream"
    >
      {/* ── Light band with the makhana bowl, resting in the dip of the curved top ── */}
      <div aria-hidden className="pointer-events-none relative bg-cream pt-[clamp(8.5rem,18vw,15rem)]">
        <div className="absolute bottom-[calc(var(--curve)*0.05)] left-1/2 z-10 w-[clamp(13rem,30vw,25rem)] -translate-x-1/2">
          <Image
            src={spicedBowl}
            quality={90}
            alt=""
            sizes="(min-width: 1024px) 25rem, 60vw"
            className="h-auto w-full drop-shadow-[0_24px_24px_rgba(20,36,16,0.35)]"
          />
        </div>

        <div className="relative h-[var(--curve)]">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            <path d="M0 0 C360 100 1080 100 1440 0 L1440 101 L0 101 Z" className="fill-forest-deep" />
          </svg>
          {pieces.map((p, i) => (
            <div
              key={i}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              className={`absolute z-20 -translate-x-1/2 -translate-y-[75%] ${p.desktopOnly ? "max-sm:hidden" : ""}`}
            >
              <Image
                src={p.src}
                alt=""
                sizes="56px"
                style={{ rotate: `${p.rotate}deg` }}
                className={`h-auto drop-shadow-[0_6px_6px_rgba(20,36,16,0.35)] ${p.size}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer body ── */}
      <div className="relative -mt-px overflow-hidden bg-forest-deep pt-8">
        <div className="relative mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            {/* Cream card: the logo's dark-green lettering would disappear on the footer green. */}
            <Link href="/" aria-label="Fresh Mewa home" className="inline-block rounded-2xl bg-cream px-5 py-3 transition-transform duration-300 hover:-rotate-2">
              <Image src={logo} alt="Fresh Mewa" sizes="9rem" className="h-auto w-32 sm:w-36" />
            </Link>
            <p className="mt-3 max-w-xs text-base text-cream/70">Roasted makhana made for everyday cravings.</p>
          </div>

          <ul className="space-y-2 font-poster text-xl uppercase tracking-[0.04em] text-cream/90">
            {["Crunch You Can Taste.", "Flavours That Make You Come Back.", "Roasted for the Right Crunch."].map((l) => (
              <li key={l} className="flex items-center gap-2.5">
                <Ornament glyph="z" className="text-xs text-gold-soft" />
                {l}
              </li>
            ))}
          </ul>

          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-cream/70 md:grid-cols-1">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-gold-soft">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/shipping-returns" className="transition-colors hover:text-gold-soft">Shipping & Returns</Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="relative mx-auto mt-10 flex max-w-7xl flex-col gap-2 border-t border-cream/10 px-5 py-5 text-xs text-cream/50 sm:flex-row sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} Fresh Mewa. All rights reserved. Desgine By Digivanta</p>
        </div>

      </div>
    </footer>
  );
}
