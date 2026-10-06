import Image, { type StaticImageData } from "next/image";
import { flavours, storyChapters, tones } from "@/lib/content";
import MakhanaPouch from "../MakhanaPouch";
import Reveal from "../ui/Reveal";
import bowl from "@/public/images/hero/makhana-bowl.webp";
import spicedBowl from "@/public/images/hero/makhana-bowl-spiced.webp";
import m1 from "@/public/images/hero/makhana-1.webp";
import m3 from "@/public/images/hero/makhana-3.webp";
import m5 from "@/public/images/hero/makhana-5.webp";

/* ── Small building blocks ─────────────────────────────────── */

const cardBg = ["bg-mint-soft", "bg-chilli-soft", "bg-gold-soft/45", "bg-pepper-soft", "bg-white"];
const tapeBg = ["bg-gold-soft", "bg-mint-soft", "bg-chilli-soft", "bg-gold-soft", "bg-mint-soft"];

/**
 * One chapter = one funky card: thick outline, hard offset shadow, a taped-on chapter label,
 * a giant outlined number, and an optional cut-out image ("sticker") hanging off the corner.
 */
function Chapter({ index, art, children }: { index: number; art?: React.ReactNode; children: React.ReactNode }) {
  const c = storyChapters[index];
  const n = String(index + 1).padStart(2, "0");
  const tilt = index % 2 ? "rotate-[0.6deg]" : "-rotate-[0.6deg]";
  return (
    <section id={c.id} className="scroll-mt-28 py-6 sm:py-8">
      <div
        className={`relative rounded-[2rem] border-2 border-forest p-6 pt-10 shadow-[6px_6px_0_0_var(--color-forest)] sm:p-9 sm:pt-12 ${cardBg[index % 5]}`}
      >
        <span
          className={`absolute -top-4 left-6 rotate-[-4deg] border-2 border-forest px-4 py-1 font-hand text-base font-bold uppercase tracking-[0.12em] text-forest ${tapeBg[index % 5]}`}
        >
          Chapter {n}
        </span>
        <span
          aria-hidden
          className="pointer-events-none absolute right-5 top-3 select-none font-poster text-[5.5rem] leading-none text-transparent opacity-30 [-webkit-text-stroke:2px_var(--color-forest)] sm:text-[7.5rem]"
        >
          {n}
        </span>
        {art && (
          <div aria-hidden className="pointer-events-none absolute -right-3 -top-12 w-24 rotate-6 sm:-right-14 sm:-top-14 sm:w-40">
            <div className="animate-[float_6s_ease-in-out_infinite] motion-reduce:animate-none">{art}</div>
          </div>
        )}

        <Reveal>
          <h2
            className={`relative max-w-[85%] font-hand text-[2.3rem] font-bold leading-[1.02] text-forest sm:text-[3.2rem] ${tilt}`}
          >
            {c.title}
          </h2>
        </Reveal>
        <div className="relative mt-5 space-y-4 text-[1.08rem] leading-[1.75] text-ink/85">{children}</div>
      </div>
    </section>
  );
}

/** Cut-out photo used as a chapter sticker. */
function Sticker({ src, small = false }: { src: StaticImageData; small?: boolean }) {
  return (
    <Image
      src={src}
      alt=""
      sizes="10rem"
      className={`h-auto drop-shadow-[0_14px_14px_rgba(30,52,24,0.3)] ${small ? "mx-auto w-[55%]" : "w-full"}`}
    />
  );
}

/** Big handwritten line — the bits you'd read out loud. */
function Hand({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`font-hand text-2xl font-bold leading-snug text-forest sm:text-[1.75rem] ${className}`}>{children}</p>;
}

function Tick() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 shrink-0 text-pista" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 13.5c2 1.2 3.4 2.8 4.6 4.8C11 12.4 14.6 8 20 4.8" />
    </svg>
  );
}

/** Hand-drawn curly arrow for annotations. */
export function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 50" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
      <path d="M4 8c14-6 30 2 26 14-3 9-16 6-12-3 5-11 30-6 48 22" />
      <path d="M58 36l8 5 1-10" />
    </svg>
  );
}

/* ── The story ─────────────────────────────────────────────── */

export default function Chapters() {
  return (
    <>
      {/* 01 */}
      <Chapter index={0} art={<Sticker src={spicedBowl} />}>
        <Hand className="text-gold">Let&apos;s be honest.</Hand>
        <Reveal className="space-y-2.5 py-1">
          {[
            "Aaj snack koi special occasion ki cheez nahi hai.",
            "Chai ke saath kuch chahiye.",
            "Kaam ke beech kuch crunchy sa.",
            "Movie lagayi toh kuch munch karne ko.",
            "Travel mein bag mein kuch hona hi chahiye.",
            "Aur kabhi-kabhi koi reason bhi nahi hota.",
          ].map((line, i) => (
            <p
              key={line}
              className={`w-fit max-w-[85%] rounded-[1.25rem] px-4 py-2.5 font-hand text-lg leading-snug ${
                i % 2 ? "ml-auto rounded-br-md bg-forest text-cream" : "rounded-bl-md bg-white text-forest ring-1 ring-forest/10"
              }`}
            >
              {line}
            </p>
          ))}
        </Reveal>
        <Hand className="text-center text-3xl sm:text-4xl">
          Bas mann karta hai. <span aria-hidden className="text-chilli">♥</span>
        </Hand>
        <p>
          Snacking is already a part of everyday life. We weren&apos;t trying to change that. We just thought the snacks we
          reach for every day could be made with a little more thought.
        </p>
      </Chapter>

      {/* 02 */}
      <Chapter index={1} art={<Sticker src={m3} small />}>
        <p>We don&apos;t believe snacking needs a lecture.</p>
        <p>
          You shouldn&apos;t have to think too much before enjoying something you like. At the same time, everyday
          snacking doesn&apos;t always have to mean reaching for the same fried chips or heavily processed options.
        </p>
        <Hand>
          <span className="marker">We wanted something in between.</span>
        </Hand>
        <p>
          Something that tastes like a real snack, feels easy to enjoy, and is made with more thought about what goes
          into it.
        </p>
        <ul className="flex flex-wrap gap-2.5 pt-1">
          {[
            ["Not complicated.", "bg-mint-soft -rotate-2"],
            ["Not overdone.", "bg-chilli-soft rotate-1"],
            ["Just right for everyday snacking.", "bg-gold-soft/60 -rotate-1"],
          ].map(([t, c]) => (
            <li key={t} className={`rounded-lg px-4 py-2 font-hand text-lg font-bold text-forest shadow-[0_6px_14px_-10px_rgba(30,52,24,0.5)] ${c}`}>
              {t}
            </li>
          ))}
        </ul>
      </Chapter>

      {/* 03 */}
      <Chapter index={2} art={<Sticker src={m1} small />}>
        <div className="grid items-center gap-6 sm:grid-cols-[1fr_12rem]">
          <div className="space-y-4">
            <p>We started with something we already knew.</p>
            <Hand className="text-4xl sm:text-5xl">Makhana.</Hand>
            <p>Familiar to Indian kitchens, easy to flavour, and naturally made for a good crunch.</p>
          </div>
          <Reveal className="relative mx-auto w-44 sm:w-full">
            <Image src={bowl} alt="Bowl of roasted makhana" sizes="12rem" className="h-auto w-full rotate-6" />
            <Squiggle className="absolute -left-16 top-1/4 hidden w-16 text-gold sm:block" />
          </Reveal>
        </div>
        <p>
          We didn&apos;t want to reinvent it. We just wanted to give it a fresher place in the way we snack today.
        </p>
        <Hand>
          <span className="marker">Something familiar, with a fresh way to enjoy it.</span>
        </Hand>
      </Chapter>

      {/* 04 */}
      <Chapter index={3} art={<MakhanaPouch flavour={flavours.find((f) => f.slug === "salt-pepper")!} sizes="10rem" className="mx-auto w-[70%]" />}>
        <p>Fresh Mewa is about the way we think a snack should be made.</p>
        <ul className="space-y-1.5">
          {["Good ingredients.", "Good flavour.", "A satisfying crunch.", "And no unnecessary fuss."].map((t) => (
            <li key={t} className="flex items-center gap-3 font-hand text-xl font-bold text-forest">
              <Tick />
              {t}
            </li>
          ))}
        </ul>
        <blockquote className="rounded-2xl border-l-4 border-gold bg-white/70 px-5 py-4 font-hand text-xl leading-snug text-forest">
          The aim isn&apos;t to make the “perfect” snack.
          <br />
          It&apos;s to make one you&apos;d happily reach for again.
        </blockquote>
        <p className="font-semibold text-forest">A snack brand made around how people actually snack.</p>
      </Chapter>

      {/* 05 */}
      <Chapter index={4} art={<MakhanaPouch flavour={flavours.find((f) => f.slug === "pudina")!} sizes="10rem" className="mx-auto w-[70%]" />}>
        <p>For us, a good snack isn&apos;t only about how it tastes.</p>
        <p>It&apos;s also about what goes into making it.</p>
        <div className="rounded-[1.5rem] bg-forest p-6 text-cream/85">
          <p>
            At Fresh Mewa, we keep things simple and avoid unnecessary additions.{" "}
            <span className="font-hand text-xl font-bold text-gold-soft">
              Our roasted makhana is made without added oil and preservatives,
            </span>{" "}
            keeping the focus on the makhana, the flavour and the crunch.
          </p>
        </div>
        <Hand>No long list of promises.</Hand>
        <p>Just a product we feel good about putting on the shelf and picking up ourselves.</p>
      </Chapter>

      {/* 06 */}
      <Chapter index={5} art={<Sticker src={bowl} />}>
        <p>Because let&apos;s face it, nobody reaches for a snack just because it sounds sensible.</p>
        <p>You reach for it because it looks good.</p>
        <p>Then comes the first bite.</p>
        <ul className="space-y-2">
          {["Does it crunch?", "Does it taste good?", "Do I want another handful?"].map((q) => (
            <li key={q} className="flex items-center gap-3 rounded-xl bg-white/70 px-4 py-2.5 font-hand text-xl font-bold text-forest ring-1 ring-forest/10">
              <span className="grid size-7 place-items-center rounded-md border-2 border-forest/40">
                <Tick />
              </span>
              {q}
            </li>
          ))}
        </ul>
        <p>That&apos;s what matters to us.</p>
        <p>Fresh Mewa is built around three simple things:</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["Crunch You Can Taste", "That satisfying first bite."],
            ["Flavours That Make You Come Back", "Because a better choice should still be enjoyable."],
            ["Roasted for the Right Crunch", "Because the texture can make all the difference."],
          ].map(([t, b], i) => (
            <div key={t} className="rounded-2xl bg-cream-deep p-4">
              <span className="font-hand text-sm font-bold text-gold">0{i + 1}</span>
              <h3 className="font-poster text-xl uppercase leading-tight text-forest">{t}</h3>
              <p className="mt-1 text-[0.95rem] leading-snug text-ink-muted">{b}</p>
            </div>
          ))}
        </div>
      </Chapter>

      {/* 07 */}
      <Chapter index={6} art={<Sticker src={m5} small />}>
        <p>Fresh Mewa isn&apos;t made for one particular kind of person.</p>
        <p>It&apos;s for</p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {[
            ["the student grabbing a snack between classes.", "bg-mint-soft -rotate-1"],
            ["The person keeping a pack at their desk.", "bg-gold-soft/50 rotate-1"],
            ["The family shared a snack at home.", "bg-chilli-soft rotate-[0.5deg]"],
            ["The traveller who always carries something to munch on.", "bg-pepper-soft -rotate-[0.5deg]"],
            ["The person sitting with chai thinking, “Bas kuch crunchy sa ho.”", "bg-white -rotate-1 sm:col-span-2"],
          ].map(([t, c]) => (
            <li key={t} className={`rounded-lg p-4 font-hand text-lg font-bold leading-snug text-forest shadow-[0_10px_20px_-14px_rgba(30,52,24,0.55)] ${c}`}>
              {t}
            </li>
          ))}
        </ul>
        <Hand className="pt-2">
          Basically, if you snack, <span className="marker">Fresh Mewa is for you.</span>
        </Hand>
      </Chapter>

      {/* 08 */}
      <Chapter index={7}>
        <p>We started with three flavours because not every day calls for the same thing.</p>
        <ul className="space-y-2.5">
          {flavours.map((f, i) => {
            const t = tones[f.tone];
            const line = ["Cool, herby and refreshing.", "Classic, savoury and familiar.", "Bold, spicy and made for a little kick."][i];
            return (
              <li key={f.slug} className={`flex items-center gap-4 rounded-2xl p-3 pr-5 ${t.soft}`}>
                <MakhanaPouch flavour={f} sizes="4rem" className="w-14 shrink-0 -rotate-6" />
                <div>
                  <h3 className={`font-hand text-2xl font-bold leading-none ${t.text}`}>{f.short}</h3>
                  <p className="mt-1 text-[0.98rem] text-forest/80">{line}</p>
                </div>
              </li>
            );
          })}
        </ul>
        <Hand>Different moods. Different cravings. Same Fresh Mewa crunch.</Hand>
      </Chapter>

      {/* 09 */}
      <Chapter index={8} art={<MakhanaPouch flavour={flavours.find((f) => f.slug === "peri-peri")!} sizes="10rem" className="mx-auto w-[70%]" />}>
        <p>Fresh Mewa starts with roasted makhana, but the idea is bigger than one product.</p>
        <p>
          We want to create snacks that fit naturally into everyday life — snacks that taste good, are made thoughtfully,
          and don&apos;t make you overthink what you&apos;re eating.
        </p>
        <p>As we grow, we&apos;ll keep that same approach.</p>
        <ul className="flex flex-wrap gap-2.5">
          {["Good taste.", "Good quality.", "No unnecessary fuss."].map((t, i) => (
            <li
              key={t}
              className={`rounded-full border-2 border-forest px-4 py-1.5 font-hand text-lg font-bold text-forest ${i === 1 ? "rotate-1" : "-rotate-1"}`}
            >
              {t}
            </li>
          ))}
        </ul>
      </Chapter>

      {/* 10 */}
      <Chapter index={9} art={<Sticker src={m1} small />}>
        <ul className="space-y-1.5 font-hand text-xl font-bold text-forest">
          <li>We don&apos;t want snacking to feel complicated.</li>
          <li>We don&apos;t want “healthy” to mean boring.</li>
          <li>And we don&apos;t want good taste to depend on unnecessary extras.</li>
        </ul>
        <p>
          We want Fresh Mewa to be the kind of brand you can understand easily, enjoy without overthinking, and keep
          around for the everyday moments that matter.
        </p>
        <Hand className="text-3xl sm:text-4xl">
          <span className="marker">That&apos;s the kind of snack we&apos;re here to make.</span>
        </Hand>
      </Chapter>
    </>
  );
}
