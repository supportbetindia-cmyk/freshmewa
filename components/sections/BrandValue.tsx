import Image from "next/image";
import Reveal from "../ui/Reveal";
import chaiBowl from "@/public/images/hero/makhana-chai-bowl.webp";

export default function BrandValue() {
  return (
    <section className="bg-cream-deep py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <h2 className="poster-h2 max-w-4xl text-forest">A Better Snack Doesn&apos;t Have to Feel Like a Compromise.</h2>
        </Reveal>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12">
          <Reveal className="relative mx-auto w-full max-w-xl">
            {/* soft gold "tabletop" glow under the bowl + kulhad */}
            <div aria-hidden className="absolute inset-x-[6%] bottom-[2%] h-[38%] rounded-[50%] bg-gold-soft/45 blur-2xl" />
            <Image
              src={chaiBowl}
              quality={75}
              alt="Green bowl of roasted makhana beside a kulhad of chai, with cinnamon and cardamom"
              sizes="(min-width: 1024px) 36rem, 90vw"
              className="relative h-auto w-full"
            />
          </Reveal>

          <div>
            <Reveal className="grid gap-3 sm:grid-cols-2">
              <p className="rounded-2xl bg-cream p-5 text-lg leading-snug text-forest">Sometimes you want something tasty.</p>
              <p className="rounded-2xl bg-forest p-5 text-lg leading-snug text-cream">
                Sometimes you want something that feels like a better choice.
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mt-5 font-display text-3xl italic text-gold sm:text-4xl">Why should you have to pick one?</p>
              <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">
                Fresh Mewa brings together roasted makhana, enjoyable flavours and satisfying crunch to create a snack
                that fits naturally into everyday life.
              </p>
              <ul className="mt-5 space-y-1 text-lg text-ink-muted">
                <li className="line-through decoration-gold decoration-2">Not a “diet food.”</li>
                <li className="line-through decoration-gold decoration-2">Not something you eat just because you should.</li>
              </ul>
              <p className="mt-3 font-poster text-3xl uppercase leading-tight text-forest sm:text-4xl">
                Just a snack you actually want to eat.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
