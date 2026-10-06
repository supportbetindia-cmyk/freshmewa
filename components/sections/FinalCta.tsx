import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PouchTrio from "../PouchTrio";
import Reveal from "../ui/Reveal";

/** Closing forest-green CTA band with the floating pouch trio. Page-specific copy goes in `children`. */
export default function FinalCta({
  title,
  cta,
  href,
  children,
}: {
  title: string;
  cta: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grain relative overflow-hidden bg-forest py-14 text-cream sm:py-16 lg:py-20">
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <Reveal>
          <h2 className="poster-h2">{title}</h2>
          {children}
          <Link href={href} className="group btn mt-6 bg-gold-soft pr-2 text-forest hover:bg-cream">
            {cta}
            <span className="grid size-9 place-items-center rounded-full bg-forest text-gold-soft transition-transform duration-500 ease-premium group-hover:-rotate-45">
              <ArrowRight className="size-4" />
            </span>
          </Link>
        </Reveal>

        <Reveal delay={0.1}>
          <PouchTrio />
        </Reveal>
      </div>
    </section>
  );
}
