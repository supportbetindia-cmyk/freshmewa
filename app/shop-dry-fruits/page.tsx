import type { Metadata } from "next";
import Marquee from "@/components/sections/Marquee";
import Faq from "@/components/sections/Faq";
import FinalCta from "@/components/sections/FinalCta";
import { BeforeYouOrder, Collection, FlavourGuide, ShopHero, ShopIntro } from "@/components/shop/ShopSections";
import { pageMeta, routes, seo, shopFaqs } from "@/lib/content";

export const metadata: Metadata = pageMeta(seo.shop, routes.shop);

export default function ShopPage() {
  return (
    <>
      <main>
        <ShopHero />
        <Marquee />
        <Collection />
        <ShopIntro />
        <FlavourGuide />
        <BeforeYouOrder />
        <Faq title="A Few Quick Answers" items={shopFaqs} />
        <FinalCta title="Found Your Pick?" cta="Shop Fresh Mewa" href="#range">
          <p className="mt-5 max-w-md font-display text-2xl italic text-gold-soft sm:text-3xl">
            Go on. Your snack drawer has room for one more.
          </p>
        </FinalCta>
      </main>
    </>
  );
}
