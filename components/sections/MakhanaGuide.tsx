import Image from "next/image";
import { education } from "@/lib/content";
import Reveal from "../ui/Reveal";
import m1 from "@/public/images/hero/makhana-1.webp";
import m3 from "@/public/images/hero/makhana-3.webp";
import m5 from "@/public/images/hero/makhana-5.webp";

export default function MakhanaGuide() {
  const [lead, ...rest] = education;
  return (
    <section id="makhana" className="scroll-mt-20 bg-cream-deep py-14 sm:py-16 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
        <Reveal className="relative overflow-hidden rounded-[1.75rem] bg-forest p-6 text-cream sm:p-8">
          <h2 className="poster-h2 relative z-10 max-w-md">{lead.q}</h2>
          <div className="relative z-10 mt-4 max-w-md space-y-3 text-base leading-relaxed text-cream/80 sm:text-lg">
            {lead.a.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          {/* Loose makhana scattered in the corner */}
          <div aria-hidden className="pointer-events-none absolute -bottom-4 -right-4 h-40 w-48 sm:h-48 sm:w-60">
            <Image src={m1} alt="" sizes="6rem" className="absolute bottom-6 right-20 w-20 rotate-12 sm:w-24" />
            <Image src={m5} alt="" sizes="6rem" className="absolute bottom-0 right-2 w-24 -rotate-12 sm:w-28" />
            <Image src={m3} alt="" sizes="5rem" className="absolute bottom-24 right-6 w-16 rotate-45 sm:w-20" />
          </div>
        </Reveal>

        <div className="grid gap-4">
          {rest.map((item, i) => (
            <Reveal key={item.q} delay={0.08 * (i + 1)} className="rounded-[1.5rem] border border-forest/10 bg-cream p-6">
              <h3 className="font-display text-2xl leading-snug text-forest sm:text-[1.7rem]">{item.q}</h3>
              <div className="mt-3 space-y-2.5 text-[0.95rem] leading-relaxed text-ink-muted sm:text-base">
                {item.a.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
