import { flavours, shopFlavours } from "@/lib/content";
import FlavourCard from "../FlavourCard";
import Reveal from "../ui/Reveal";

export default function Flavours() {
  return (
    <section id="flavours" className="scroll-mt-20 py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">Find your snack mood</p>
            <h2 className="poster-h2 text-forest">Pick Your <span className="text-gold">Crunch</span></h2>
          </div>
          <p className="max-w-sm font-display text-xl italic text-gold sm:text-2xl lg:text-right">
            Three flavours. Three moods. One seriously snackable ingredient.
          </p>
        </Reveal>
      </div>

      {/* Mobile: swipeable row. Desktop: three columns. */}
      <div className="mx-auto mt-8 flex max-w-7xl snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:px-8 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible">
        {flavours.map((f, i) => (
          <FlavourCard
            key={f.slug}
            flavour={f}
            index={i}
            tagline={f.tagline}
            description={shopFlavours[f.slug].description}
            cta={f.cta}
            href={`/shop/${f.slug}`}
            showcase
            className="w-[82%] shrink-0 snap-center sm:w-[60%] lg:w-auto"
          />
        ))}
      </div>
    </section>
  );
}
