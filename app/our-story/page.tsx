import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Chapters, { Squiggle } from "@/components/story/Chapters";
import { ChapterNav, ReadingProgress } from "@/components/story/StoryNav";
import Faq from "@/components/sections/Faq";
import FinalCta from "@/components/sections/FinalCta";
import Reveal from "@/components/ui/Reveal";
import { flavours, storyFaqs, tones } from "@/lib/content";
import m1 from "@/public/images/hero/makhana-1.webp";
import m5 from "@/public/images/hero/makhana-5.webp";
import spicedBowl from "@/public/images/hero/makhana-bowl-spiced.webp";
import MakhanaPouch from "@/components/MakhanaPouch";

const letterColor = ["text-forest", "text-chilli", "text-gold", "text-mint", "text-forest", "text-chilli", "text-mint", "text-gold", "text-forest"];

export const metadata: Metadata = {
  title: "Our Story — Fresh Mewa",
  description:
    "We snack. A lot. Why Fresh Mewa started with roasted makhana, made without added oil and preservatives, for the way people actually snack.",
};

export default function OurStoryPage() {
  return (
    <>
      <ReadingProgress />
      <main>
        {/* ── Hero: sticker collage around wobbly poster letters ── */}
        <section className="grain relative overflow-hidden pb-14 pt-28 lg:pb-16 lg:pt-32">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <Image src={spicedBowl} alt="" sizes="22rem" className="absolute -bottom-6 -left-10 w-48 -rotate-12 sm:w-72 lg:-left-6 lg:bottom-0 lg:w-[22rem]" />
            <div className="absolute -right-4 top-24 w-24 rotate-12 sm:right-[6%] sm:w-32 lg:top-28 lg:w-40">
              <MakhanaPouch flavour={flavours[2]} sizes="10rem" />
            </div>
            <div className="absolute bottom-6 right-[16%] hidden w-28 -rotate-6 md:block lg:w-32">
              <MakhanaPouch flavour={flavours[0]} sizes="8rem" />
            </div>
            <Image src={m1} alt="" sizes="6rem" className="absolute left-[12%] top-28 w-14 animate-[float_5s_ease-in-out_infinite] motion-reduce:animate-none sm:w-20" />
            <Image src={m5} alt="" sizes="6rem" className="absolute right-[34%] top-24 hidden w-14 rotate-45 animate-[float_7s_ease-in-out_infinite] motion-reduce:animate-none md:block" />
          </div>

          <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8">
            <Reveal>
              <p className="inline-block -rotate-3 rounded-full border-2 border-forest bg-gold-soft px-4 py-1 font-hand text-xl font-bold text-forest shadow-[3px_3px_0_0_var(--color-forest)] sm:text-2xl">
                Fresh Mewa
              </p>
              <h1 aria-label="Our Story" className="mt-4 font-poster text-[clamp(4.2rem,14vw,10.5rem)] font-normal uppercase leading-[0.82]">
                {"OUR STORY".split("").map((ch, i) =>
                  ch === " " ? (
                    <span key={i} className="inline-block w-[0.25em]" />
                  ) : (
                    <span
                      key={i}
                      aria-hidden
                      className={`inline-block transition-transform duration-300 hover:-translate-y-2 hover:rotate-0 ${letterColor[i % letterColor.length]} ${
                        i % 2 ? "rotate-[4deg]" : "-rotate-[3deg]"
                      }`}
                    >
                      {ch}
                    </span>
                  ),
                )}
              </h1>
            </Reveal>

            <Reveal delay={0.1} className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
              {flavours.map((f, i) => (
                <span
                  key={f.slug}
                  className={`rounded-full border-2 border-forest px-4 py-1 font-hand text-lg font-bold text-cream ${tones[f.tone].solid} ${
                    ["-rotate-6", "rotate-3", "-rotate-2"][i]
                  }`}
                >
                  {f.short}
                </span>
              ))}
              <span className="relative ml-1 rotate-2 rounded-2xl border-2 border-forest bg-white px-4 py-2 font-hand text-lg font-bold text-forest">
                “Bas kuch crunchy sa ho.”
                <span aria-hidden className="absolute -bottom-2 left-6 size-3.5 rotate-45 border-b-2 border-r-2 border-forest bg-white" />
              </span>
            </Reveal>

            <Reveal delay={0.18} className="relative mt-8 inline-block">
              <a
                href="#we-snack"
                className="group inline-flex items-center gap-3 rounded-[999px] border-[3px] border-forest bg-cream px-6 py-3 font-hand text-xl font-bold text-forest shadow-[5px_5px_0_0_var(--color-forest)] transition-[transform,box-shadow,background-color,color] duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-forest hover:text-cream hover:shadow-[2px_2px_0_0_var(--color-forest)] sm:px-9 sm:text-2xl"
              >
                Short story looong of why we exist
                <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.4} />
              </a>
              <Squiggle className="absolute -right-20 -top-10 hidden w-20 text-gold sm:block" />
            </Reveal>
          </div>
        </section>

        {/* ── Chapters ── */}
        <div className="bg-cream-deep/50">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-6 sm:px-8 lg:grid-cols-[14rem_minmax(0,44rem)] lg:justify-between lg:py-12">
            <aside>
              <ChapterNav />
            </aside>
            <article>
              <Chapters />
            </article>
          </div>
        </div>

        <Faq title="A Few Things You Might Be Wondering" items={storyFaqs} />

        <FinalCta title="So, What Are You Snacking On Today?" cta="Explore Fresh Mewa" href="/shop">
          <ul className="mt-5 flex flex-wrap gap-2">
            {flavours.map((f) => (
              <li
                key={f.slug}
                className={`rounded-full px-4 py-1.5 font-poster text-xl uppercase tracking-[0.06em] text-cream ${tones[f.tone].solid}`}
              >
                {f.short}.
              </li>
            ))}
          </ul>
        </FinalCta>
      </main>
    </>
  );
}
