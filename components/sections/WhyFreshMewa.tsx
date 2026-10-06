import { differences } from "@/lib/content";
import Reveal from "../ui/Reveal";

export default function WhyFreshMewa() {
  return (
    <section id="why" className="grain relative scroll-mt-20 bg-forest py-14 text-cream sm:py-16 lg:py-20">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <h2 className="poster-h2 max-w-3xl">
            What Makes <span className="text-gold-soft">Fresh Mewa</span> Different?
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-4 md:grid-cols-3 md:gap-5">
          {differences.map((d, i) => (
            <Reveal
              key={d.title}
              delay={i * 0.08}
              className="rounded-[1.5rem] border border-cream/12 bg-cream/[0.04] p-6 transition-colors duration-500 hover:bg-cream/[0.08]"
            >
              <span className="font-poster text-5xl leading-none text-gold-soft">0{i + 1}</span>
              <h3 className="mt-3 font-poster text-2xl uppercase leading-tight tracking-[0.02em] sm:text-3xl">{d.title}</h3>
              <div className="mt-3 space-y-2.5 text-[0.95rem] leading-relaxed text-cream/75">
                {d.body.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
