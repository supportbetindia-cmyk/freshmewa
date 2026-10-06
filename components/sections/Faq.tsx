import { Plus } from "lucide-react";
import Reveal from "../ui/Reveal";

type QA = { q: string; a: string[] };

/**
 * FAQ accordion (native <details>) + FAQPage structured data so answer engines can quote it.
 * `schemaExtra` adds Q&As that appear elsewhere on the page (e.g. the makhana explainer).
 */
export default function Faq({
  title,
  items,
  schemaExtra = [],
}: {
  title: React.ReactNode;
  items: QA[];
  schemaExtra?: QA[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [...schemaExtra, ...items].map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a.join(" ") },
    })),
  };

  return (
    <section id="faq" className="scroll-mt-20 py-14 sm:py-16 lg:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <Reveal className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="poster-h2 text-forest">{title}</h2>
        </Reveal>

        <Reveal delay={0.06} className="divide-y divide-forest/10 border-y border-forest/10">
          {items.map((f) => (
            <details key={f.q} className="group py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-display text-lg text-forest sm:text-xl [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-forest/15 transition-[transform,background-color] duration-500 ease-premium group-open:rotate-45 group-open:bg-gold-soft">
                  <Plus className="size-4" />
                </span>
              </summary>
              <div className="space-y-1.5 pb-5 pr-12 text-[0.95rem] leading-relaxed text-ink-muted sm:text-base">
                {f.a.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
