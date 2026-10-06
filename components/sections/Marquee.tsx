import { flavours } from "@/lib/content";

/** Flavour ticker between the hero and the intro. Pure CSS animation (transform only). */
export default function Marquee() {
  const items = [...flavours, ...flavours, ...flavours];
  return (
    <div aria-hidden className="overflow-hidden bg-forest py-3.5 text-cream">
      <div className="animate-marquee flex w-max animate-[marquee_32s_linear_infinite] gap-8 whitespace-nowrap font-poster text-xl uppercase tracking-[0.12em] sm:text-2xl">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center gap-8">
            {items.map((f, i) => (
              <span key={`${half}-${i}`} className="flex items-center gap-8">
                {f.short}
                <span className="font-ornament text-base text-gold-soft">z</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
