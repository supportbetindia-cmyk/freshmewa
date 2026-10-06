import { BookOpen, Briefcase, Coffee, Film, Home, Plane } from "lucide-react";
import { moments } from "@/lib/content";
import Reveal from "../ui/Reveal";

const icons = { coffee: Coffee, briefcase: Briefcase, book: BookOpen, film: Film, plane: Plane, home: Home };

export default function Moments() {
  return (
    <section className="py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <h2 className="poster-h2 max-w-4xl text-forest">
            For the <span className="text-gold">“I Just Feel Like Snacking”</span> Moments
          </h2>
        </Reveal>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {moments.map((m, i) => {
            const Icon = icons[m.icon];
            return (
              <Reveal
                key={m.title}
                delay={(i % 3) * 0.06}
                className="group rounded-[1.25rem] border border-forest/10 bg-white/55 p-4 transition-colors duration-500 hover:bg-forest sm:p-6"
              >
                <span className="grid size-10 place-items-center rounded-full bg-gold-soft/60 text-forest transition-colors duration-500 group-hover:bg-gold-soft sm:size-12">
                  <Icon className="size-5" strokeWidth={1.6} />
                </span>
                <h3 className="mt-3 font-poster text-xl uppercase leading-none tracking-[0.03em] text-forest transition-colors duration-500 group-hover:text-cream sm:mt-4 sm:text-3xl">
                  {m.title}
                </h3>
                <p className="mt-2 text-sm leading-snug text-ink-muted transition-colors duration-500 group-hover:text-cream/75 sm:text-base">
                  {m.body}
                </p>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <p className="mt-6 text-center font-display text-2xl italic text-gold sm:text-3xl">
            Fresh Mewa fits into the day you&apos;re already having.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
