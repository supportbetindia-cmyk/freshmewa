import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Leaf, Sparkles } from "lucide-react";
import makhana from "@/public/images/hero/makhana-1.webp";
import makhanaTwo from "@/public/images/hero/makhana-3.webp";
import { formatINR, packs, tones, type Flavour } from "@/lib/content";
import CartButtons from "./CartButtons";
import MakhanaPouch from "./MakhanaPouch";
import Reveal from "./ui/Reveal";

/**
 * Flavour product card — homepage + shop. Layout width comes from `className`.
 * With `shop`, the card gets Add to Cart / Buy Now; otherwise a single CTA link.
 */
export default function FlavourCard({
  flavour: f,
  index,
  tagline,
  description,
  cta,
  href,
  shop = false,
  showcase = false,
  className = "",
}: {
  flavour: Flavour;
  index: number;
  tagline: string;
  description: string;
  cta: string;
  href: string;
  shop?: boolean;
  showcase?: boolean;
  className?: string;
}) {
  const t = tones[f.tone];
  // Size the background word so every flavour name spans the stage (Veneer ≈ 0.39em per glyph).
  const wordSize = `${Math.min(34, 96 / (f.short.length * 0.39))}cqw`;

  return (
    <Reveal
      id={f.slug}
      delay={index * 0.08}
      className={`group relative flex scroll-mt-24 flex-col overflow-hidden rounded-[2rem] bg-white/70 ring-1 ring-forest/10 transition-[translate,box-shadow] duration-500 ease-premium hover:-translate-y-1.5 hover:shadow-[0_32px_60px_-30px_rgba(30,52,24,0.5)] ${className}`}
    >
      {/* ── Stage ── */}
      <div className={`relative overflow-hidden @container ${showcase ? `grain aspect-square ${f.tone === "chilli" ? "bg-[#edb69f]" : f.tone === "pepper" ? "bg-cream-deep" : "bg-mint-soft"}` : `aspect-[5/4] ${t.soft}`}`}>
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(55%_60%_at_50%_42%,rgb(255_255_255/0.75),transparent_75%)]" />
        <span
          aria-hidden
          style={{ fontSize: wordSize }}
          className={`absolute inset-x-0 ${showcase ? "top-[20%] opacity-25" : "top-[12%] opacity-[0.14]"} select-none whitespace-nowrap text-center font-poster uppercase leading-none transition-transform duration-700 ease-premium motion-safe:group-hover:scale-105 ${t.text}`}
        >
          {f.short}
        </span>

        <div className="absolute inset-x-4 top-4 flex items-center justify-between">
          <span className="rounded-full bg-white/75 px-3 py-1 font-poster text-sm tracking-[0.14em] text-forest backdrop-blur-sm">
            0{index + 1}
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-white/75 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-forest backdrop-blur-sm">
            <span className={`size-2 rounded-full ${t.solid}`} />
            Roasted Makhana
          </span>
        </div>

        {showcase && (
          <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${t.text}`}>
            <FlavourAccents tone={f.tone} />
            <Image src={makhana} alt="" sizes="80px" className="absolute bottom-[20%] left-[5%] h-auto w-[19%] -rotate-12 transition-transform duration-700 motion-safe:group-hover:-translate-y-3 motion-safe:group-hover:-rotate-[25deg]" />
            <Image src={makhanaTwo} alt="" sizes="64px" className="absolute right-[5%] top-[33%] h-auto w-[15%] rotate-[20deg] transition-transform duration-700 motion-safe:group-hover:-translate-y-2 motion-safe:group-hover:rotate-[35deg]" />
            <span className="absolute bottom-4 right-4 rotate-[-8deg] rounded-full border-2 border-current bg-cream px-3 py-1 font-hand text-base font-bold shadow-[3px_3px_0_currentColor]">
              {f.tone === "mint" ? "Fresh feels!" : f.tone === "pepper" ? "The classic!" : "A little kick!"}
            </span>
          </div>
        )}

        {/* Pouch + soft contact shadow */}
        <div aria-hidden className="absolute bottom-[5%] left-1/2 h-[7%] w-[38%] -translate-x-1/2 rounded-[50%] bg-forest/25 blur-md transition-transform duration-700 ease-premium group-hover:scale-x-90" />
        <div className={`absolute bottom-[7%] left-1/2 -translate-x-1/2 ${showcase ? "w-[43%]" : "w-[38%]"}`}>
          <MakhanaPouch
            flavour={f}
            sizes={showcase ? "(min-width: 1280px) 170px, (min-width: 1024px) 14vw, 40vw" : "(min-width: 1024px) 12vw, 40vw"}
            className={`transition-transform duration-700 ease-premium motion-safe:group-hover:-translate-y-3 motion-safe:group-hover:-rotate-3 ${showcase ? f.tone === "pepper" ? "rotate-6" : "-rotate-6" : ""}`}
          />
        </div>
      </div>

      {/* ── Details ── */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-poster text-[1.9rem] uppercase leading-[0.95] text-forest sm:text-[2.1rem]">{f.name}</h3>
          {shop && (
            <Link
              href={href}
              aria-label={`View ${f.name}`}
              className="grid size-10 shrink-0 place-items-center rounded-full border border-forest/15 text-forest transition-[background-color,color,rotate] duration-500 ease-premium hover:rotate-45 hover:bg-forest hover:text-cream"
            >
              <ArrowUpRight className="size-4" />
            </Link>
          )}
        </div>
        <p className={`mt-2 font-display text-lg italic leading-snug ${t.text}`}>{tagline}</p>
        <p className="mt-2.5 flex-1 text-[0.95rem] leading-relaxed text-ink-muted">{description}</p>
        {(shop || showcase) && (
          <p className="mt-3 flex items-baseline gap-2 text-sm text-ink-muted">
            From <span className="font-poster text-2xl leading-none text-forest">{formatINR(packs[0].price)}</span>
            {shop ? <span className="line-through">{formatINR(packs[0].mrp)}</span> : <span className="ml-auto text-xs">{packs[0].label} pack</span>}
          </p>
        )}

        <div className="mt-5 border-t border-forest/10 pt-4">
          {shop ? (
            <>
              <CartButtons slug={f.slug} name={f.name} />
              <Link
                href={href}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-forest underline decoration-forest/25 underline-offset-4 transition-colors hover:decoration-forest"
              >
                {cta}
                <ArrowRight className="size-3.5" />
              </Link>
            </>
          ) : (
            <Link href={href} className="group/cta btn btn-primary w-full justify-between pr-2">
              {cta}
              <span className="grid size-9 place-items-center rounded-full bg-gold-soft text-forest transition-transform duration-500 ease-premium group-hover/cta:-rotate-45">
                <ArrowRight className="size-4" />
              </span>
            </Link>
          )}
        </div>
      </div>
    </Reveal>
  );
}

function FlavourAccents({ tone }: { tone: Flavour["tone"] }) {
  return (
    <>
      <Sparkles className="absolute bottom-[38%] right-[8%] size-7 rotate-12" strokeWidth={1.5} />
      {tone === "mint" ? (
        <>
          <Leaf className="absolute left-[7%] top-[30%] size-14 -rotate-[35deg] fill-mint/20" strokeWidth={1.4} />
          <Leaf className="absolute bottom-[9%] right-[22%] size-11 rotate-[65deg] fill-mint/20" strokeWidth={1.4} />
        </>
      ) : tone === "pepper" ? (
        <>
          <div className="absolute left-[8%] top-[35%] flex -rotate-12 gap-2">
            <span className="size-4 rounded-full bg-pepper shadow-[inset_2px_2px_0_#ffffff40]" />
            <span className="mt-4 size-3 rounded-full bg-pepper" />
            <span className="size-5 rounded-full bg-pepper shadow-[inset_2px_2px_0_#ffffff40]" />
          </div>
          <span className="absolute bottom-[12%] left-[19%] rotate-12 font-hand text-5xl font-bold">&</span>
        </>
      ) : (
        <svg viewBox="0 0 80 110" className="absolute left-[5%] top-[27%] h-24 w-16 -rotate-[20deg]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M47 27c-6-9-21-5-24 8-6 25-3 46-17 65 33-8 56-38 56-61 0-10-6-15-15-12Z" fill="currentColor" fillOpacity="0.2" />
          <path d="M47 27c8-14 7-20 19-22M30 42c-3 12-2 24-7 37M65 70l8-4M65 82l9 2" />
        </svg>
      )}
    </>
  );
}
