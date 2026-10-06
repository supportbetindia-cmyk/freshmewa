import Hero from "@/components/Hero";
import Marquee from "@/components/sections/Marquee";
import Intro from "@/components/sections/Intro";
import BrandValue from "@/components/sections/BrandValue";
import Flavours from "@/components/sections/Flavours";
import WhyFreshMewa from "@/components/sections/WhyFreshMewa";
import Moments from "@/components/sections/Moments";
import BrandStory from "@/components/sections/BrandStory";
import Philosophy from "@/components/sections/Philosophy";
import MakhanaGuide from "@/components/sections/MakhanaGuide";
import Faq from "@/components/sections/Faq";
import FinalCta from "@/components/sections/FinalCta";
import { education, faqs, flavours, tones } from "@/lib/content";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Marquee />
        <Intro />
        <BrandValue />
        <Flavours />
        <WhyFreshMewa />
        <Moments />
        <BrandStory />
        <Philosophy />
        <MakhanaGuide />
        <Faq
          title={
            <>
              Questions? <span className="text-gold">We&apos;ve Got You.</span>
            </>
          }
          items={faqs}
          schemaExtra={education}
        />
        <FinalCta title="Your Snack Break Just Got Crunchier." cta="Shop Fresh Mewa" href="/shop">
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
          <p className="mt-5 max-w-md text-base leading-relaxed text-cream/75 sm:text-lg">
            Whatever your mood, there&apos;s a Fresh Mewa waiting for it.
          </p>
          <p className="mt-2 font-display text-2xl italic text-gold-soft sm:text-3xl">Premium Snacking, Made for Every Day.</p>
        </FinalCta>
      </main>
    </>
  );
}
