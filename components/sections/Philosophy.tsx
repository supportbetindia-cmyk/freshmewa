import Reveal from "../ui/Reveal";
import { Ornament } from "../ui/Ornaments";

export default function Philosophy() {
  return (
    <section className="py-14 text-center sm:py-16 lg:py-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <Reveal>
          <Ornament glyph="7" className="text-4xl text-gold" />
          <h2 className="poster-h2 mt-2 text-forest">Premium Doesn&apos;t Have to Mean Complicated.</h2>
          <p className="mt-4 font-display text-2xl italic text-gold sm:text-3xl">We like good things.</p>
        </Reveal>

        <Reveal delay={0.06}>
          <ul className="mt-5 flex flex-wrap justify-center gap-2 sm:gap-3">
            {["Good quality.", "Good flavour.", "Good crunch.", "Good ingredients."].map((g) => (
              <li
                key={g}
                className="rounded-full border border-forest/15 bg-white/60 px-4 py-2 font-poster text-lg uppercase tracking-[0.06em] text-forest sm:px-5 sm:text-xl"
              >
                {g}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
            But we don&apos;t think a snack needs to feel fancy just to feel premium. Fresh Mewa is about making quality
            snacking feel easy, approachable and part of everyday life.
          </p>
        </Reveal>

        <Reveal delay={0.12} className="mt-7 grid gap-3 sm:grid-cols-2">
          <p className="rounded-[1.25rem] bg-forest px-6 py-5 font-poster text-2xl uppercase leading-tight text-gold-soft sm:text-3xl">
            Premium enough to feel special.
          </p>
          <p className="rounded-[1.25rem] bg-gold-soft px-6 py-5 font-poster text-2xl uppercase leading-tight text-forest sm:text-3xl">
            Easy enough to enjoy anytime.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
