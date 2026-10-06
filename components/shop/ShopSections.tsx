import { Archive, ArrowRight, ArrowUpRight, ListChecks, Package, Sparkles, Truck } from "lucide-react";
import { flavours, orderInfo, shopFlavours, tones } from "@/lib/content";
import FlavourCard from "../FlavourCard";
import PouchTrio from "../PouchTrio";
import Reveal from "../ui/Reveal";
import { Ornament } from "../ui/Ornaments";

export function ShopHero() {
  return (
    <section className="grain relative overflow-hidden pb-12 pt-28 lg:pb-14 lg:pt-32">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(40%_55%_at_78%_55%,var(--color-gold-soft)_0%,transparent_75%)] opacity-50"
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-5 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
        <Reveal>
          <h1 className="font-poster text-[clamp(3.6rem,10vw,8.5rem)] font-normal uppercase leading-[0.84] text-forest">
            Shop <span className="block text-gold">Fresh Mewa</span>
          </h1>
          <p className="mt-4 font-display text-2xl italic leading-snug text-gold sm:text-3xl">
            Three flavours. Which one are you taking home?
          </p>
          <p className="mt-3 max-w-md text-base leading-relaxed text-ink-muted sm:text-lg">
            Pudina, Salt &amp; Pepper or Peri Peri choose what sounds right and make it yours.
          </p>
          <a href="#range" className="group btn btn-primary mt-6 pr-2">
            Browse Makhana
            <span className="grid size-9 place-items-center rounded-full bg-gold-soft text-forest transition-transform duration-500 ease-premium group-hover:rotate-90">
              <ArrowRight className="size-4" />
            </span>
          </a>
        </Reveal>

        <Reveal delay={0.12} className="relative">
          <div aria-hidden className="absolute inset-x-[8%] bottom-0 top-[12%] rounded-full border border-dashed border-gold/40" />
          <PouchTrio priority />
        </Reveal>
      </div>
    </section>
  );
}

export function ShopIntro() {
  const maybes = [
    { line: "Maybe you're after something cool and minty.", tone: tones.mint },
    { line: "Maybe you like the classics.", tone: tones.pepper },
    { line: "Or maybe you want a little heat.", tone: tones.chilli },
  ];
  return (
    <section className="py-14 sm:py-16">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-14">
        <Reveal>
          <h2 className="poster-h2 text-forest">Start Here</h2>
          <p className="mt-3 font-display text-2xl italic text-gold sm:text-3xl">No need to overthink it.</p>
        </Reveal>
        <Reveal delay={0.08}>
          <ul className="grid gap-2.5">
            {maybes.map(({ line, tone }) => (
              <li key={line} className={`flex items-center gap-3 rounded-2xl px-5 py-4 text-lg text-forest ${tone.soft}`}>
                <span className={`size-2.5 shrink-0 rounded-full ${tone.solid}`} />
                {line}
              </li>
            ))}
          </ul>
          <p className="mt-4 font-poster text-2xl uppercase leading-tight text-forest sm:text-3xl">
            Whatever sounds good right now, there&apos;s a pack waiting for you.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function Collection() {
  return (
    <section id="range" className="scroll-mt-20 bg-cream-deep py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <h2 className="poster-h2 text-forest">The Fresh Mewa Range</h2>
        </Reveal>
      </div>
      {/* Mobile: swipeable row. Tablet/desktop: grid. */}
      <div className="mx-auto mt-8 flex max-w-7xl snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-8 lg:grid-cols-3 lg:gap-5">
          {flavours.map((f, i) => (
            <FlavourCard
              key={f.slug}
              flavour={f}
              index={i}
              tagline={shopFlavours[f.slug].tagline}
              description={shopFlavours[f.slug].description}
              cta="View Product"
              href={`/shop/${f.slug}`}
              shop
              className="w-[86%] shrink-0 snap-center sm:w-auto"
            />
          ))}
      </div>
    </section>
  );
}

export function FlavourGuide() {
  return (
    <section className="grain relative bg-forest py-14 text-cream sm:py-16 lg:py-20">
      <div className="relative mx-auto grid max-w-7xl gap-6 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <Reveal>
          <h2 className="poster-h2">
            Can&apos;t Decide? <span className="text-gold-soft">This Might Help.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <ul className="divide-y divide-cream/10 border-y border-cream/10">
            {flavours.map((f) => (
              <li key={f.slug}>
                <a
                  href={`#${f.slug}`}
                  className="group flex items-center gap-4 py-4 transition-colors duration-500 hover:text-gold-soft"
                >
                  <span className={`size-3 shrink-0 rounded-full ${tones[f.tone].solid} ring-2 ring-cream/20`} />
                  <span className="flex-1 sm:flex sm:items-center sm:gap-4">
                    <span className="block font-poster text-3xl uppercase leading-none sm:w-56 sm:shrink-0 sm:text-4xl">
                      {f.short}
                    </span>
                    <span className="mt-1 block text-base text-cream/75 sm:mt-0 sm:text-lg">{shopFlavours[f.slug].guide}</span>
                  </span>
                  <ArrowUpRight className="size-5 shrink-0 opacity-50 transition-transform duration-500 ease-premium group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-5 flex items-center gap-3 font-display text-2xl italic text-gold-soft sm:text-3xl">
            <Ornament glyph="z" className="text-base" />
            Or make life easier — try all three.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

const infoIcons = { sparkles: Sparkles, list: ListChecks, package: Package, archive: Archive, truck: Truck };

export function BeforeYouOrder() {
  return (
    <section className="bg-cream-deep py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <h2 className="poster-h2 text-forest">Before You Order</h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {orderInfo.map((item, i) => {
            const Icon = infoIcons[item.icon];
            return (
              <Reveal
                key={item.title}
                delay={i * 0.05}
                className={`rounded-[1.25rem] border border-forest/10 bg-cream p-4 sm:p-5 ${i === 0 ? "col-span-2 lg:col-span-1" : ""}`}
              >
                <span className="grid size-10 place-items-center rounded-full bg-gold-soft/60 text-forest">
                  <Icon className="size-5" strokeWidth={1.6} />
                </span>
                <h3 className="mt-3 font-poster text-xl uppercase leading-none tracking-[0.03em] text-forest sm:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-snug text-ink-muted sm:text-[0.95rem]">{item.body}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
