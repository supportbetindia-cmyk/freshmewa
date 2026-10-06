import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Reveal from "../ui/Reveal";
import { Ornament } from "../ui/Ornaments";
import plainBowl from "@/public/images/hero/makhana-bowl.webp";

export default function BrandStory() {
  return (
    <section id="story" className="scroll-mt-20 bg-cream-deep py-14 sm:py-16 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Reveal>
            <h2 className="poster-h2 text-forest">
              Why <span className="text-gold">Fresh Mewa?</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="relative mx-auto mt-6 w-[70%] max-w-sm lg:mx-0 lg:w-[80%]">
            <div aria-hidden className="absolute -inset-[6%] rounded-full border border-dashed border-gold/40" />
            <Image src={plainBowl} quality={90} alt="Bowl of roasted makhana" sizes="(min-width: 1024px) 24rem, 70vw" className="relative h-auto w-full" />
          </Reveal>
        </div>

        <div className="space-y-4 text-base leading-relaxed text-ink-muted sm:text-lg">
          <Reveal>
            <p className="font-display text-2xl leading-snug text-forest sm:text-3xl">Snacking is already part of everyday life.</p>
          </Reveal>
          <Reveal>
            <p>
              We snack while working, while travelling, with chai, during study breaks, while watching a movie and
              sometimes simply because we&apos;re craving something crunchy.
            </p>
          </Reveal>
          <Reveal>
            <p>So we started with a simple thought:</p>
            <blockquote className="mt-3 border-l-2 border-gold pl-5 font-display text-3xl italic leading-tight text-gold sm:text-4xl">
              Why should a better snack have to feel boring?
            </blockquote>
          </Reveal>
          <Reveal>
            <p className="font-semibold text-forest">Makhana felt like the right place to begin.</p>
            <p className="mt-3">
              It&apos;s familiar, versatile and perfect for creating a satisfying crunch. We gave it a modern,
              flavour-first personality and built Fresh Mewa around the kind of snacking people actually enjoy.
            </p>
          </Reveal>
          <Reveal>
            <ul className="space-y-1.5 text-forest">
              {[
                "Something easy to pick up.",
                "Something good to share.",
                "Something you don't need to save for a “special” day.",
              ].map((line) => (
                <li key={line} className="flex items-baseline gap-3">
                  <Ornament glyph="z" className="text-sm text-gold" />
                  {line}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal>
            <p className="pt-2 font-poster text-3xl uppercase leading-tight text-forest sm:text-4xl">
              Fresh Mewa is made for everyday snacking.
            </p>
          </Reveal>
          <Reveal>
            <Link
              href="/our-story"
              className="group mt-2 inline-flex items-center gap-3 rounded-full border-[3px] border-forest px-6 py-2.5 font-hand text-xl font-bold text-forest transition-colors duration-300 hover:bg-forest hover:text-cream"
            >
              Short story looong of why we exist
              <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.4} />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
