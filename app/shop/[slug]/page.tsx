import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Leaf, PackageCheck, Truck } from "lucide-react";
import FlavourCard from "@/components/FlavourCard";
import BuyBox from "@/components/product/BuyBox";
import ProductGallery from "@/components/product/ProductGallery";
import Reveal from "@/components/ui/Reveal";
import { faqs, flavours, packs, productDetails, shopFlavours, tones } from "@/lib/content";

const storage = faqs.find((f) => f.q === "How should I store roasted makhana?")!.a[0];

export function generateStaticParams() {
  return flavours.map((f) => ({ slug: f.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const f = flavours.find((x) => x.slug === slug);
  if (!f) return {};
  return {
    title: `${f.name} — Fresh Mewa`,
    description: `${f.tagline} ${shopFlavours[slug].description}`,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const f = flavours.find((x) => x.slug === slug);
  if (!f) notFound();

  const shop = shopFlavours[slug];
  const details = productDetails[slug];
  const t = tones[f.tone];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: f.name,
    description: `${f.description} ${shop.description}`,
    brand: { "@type": "Brand", name: "Fresh Mewa" },
    offers: packs.map((p) => ({
      "@type": "Offer",
      name: p.label,
      price: p.price,
      priceCurrency: "INR",
      url: `/shop/${slug}`,
    })),
  };

  return (
    <>
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />

        {/* ── Gallery + buy box ── */}
        <section className="pb-12 pt-24 lg:pb-16 lg:pt-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-sm text-ink-muted">
              <Link href="/shop" className="hover:text-forest">
                Shop
              </Link>
              <ChevronRight className="size-3.5" />
              <span aria-current="page" className="font-semibold text-forest">
                {f.name}
              </span>
            </nav>

            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-12">
              <ProductGallery flavour={f} />

              <div>
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-forest ${t.soft}`}>
                  <span className={`size-2 rounded-full ${t.solid}`} />
                  Roasted Makhana
                </span>
                <h1 className="mt-3 font-poster text-[clamp(3rem,6vw,5.2rem)] font-normal uppercase leading-[0.88] text-forest">
                  {f.name}
                </h1>
                <p className={`mt-3 font-display text-2xl italic ${t.text}`}>{f.tagline}</p>
                <p className="mt-3 text-base leading-relaxed text-ink-muted sm:text-lg">{f.description}</p>

                <div className="mt-6">
                  <BuyBox flavour={f} />
                </div>

                <ul className="mt-5 grid gap-2 text-sm text-ink sm:grid-cols-3">
                  <li className="flex items-center gap-2">
                    <Leaf className="size-4 text-pista" /> Roasted for the Right Crunch
                  </li>
                  <li className="flex items-center gap-2">
                    <PackageCheck className="size-4 text-pista" /> Packed to preserve freshness
                  </li>
                  <li className="flex items-center gap-2">
                    <Truck className="size-4 text-pista" /> Delivered to your doorstep
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Product details ── */}
        <section className="bg-cream-deep py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <h2 className="poster-h2 text-forest">The Details</h2>
            </Reveal>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Reveal className="rounded-[1.5rem] bg-cream p-6 lg:row-span-2">
                <h3 className="font-poster text-2xl uppercase text-forest">Nutritional Information</h3>
                <p className="text-xs uppercase tracking-[0.16em] text-ink-muted">Approx. per 30 g serving</p>
                <table className="mt-4 w-full text-[0.95rem]">
                  <tbody className="divide-y divide-forest/10">
                    {details.nutrition.map(([k, v]) => (
                      <tr key={k}>
                        <th scope="row" className="py-2.5 text-left font-normal text-ink-muted">
                          {k}
                        </th>
                        <td className="py-2.5 text-right font-semibold text-forest">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-3 text-xs text-ink-muted">Refer to the pack for the final declared values.</p>
              </Reveal>

              <DetailCard title="About This Flavour" delay={0.05}>
                <p>{shop.description}</p>
                <p className="mt-2">{shop.guide}</p>
              </DetailCard>
              <DetailCard title="Ingredients" delay={0.1}>
                <p>{details.ingredients}</p>
              </DetailCard>
              <DetailCard title="Storage" delay={0.05}>
                <p>{storage}</p>
              </DetailCard>
              <DetailCard title="Shipping" delay={0.1}>
                <p>Pricing, stock and delivery details are displayed at the time of purchase.</p>
                <Link href="/shipping-returns" className="mt-3 inline-block font-semibold text-forest underline underline-offset-4">Read shipping & returns details</Link>
              </DetailCard>
            </div>
          </div>
        </section>

        {/* ── Other flavours ── */}
        <section className="py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="poster-h2 text-forest">Try Another Mood</h2>
              <p className="font-display text-xl italic text-gold">Or make life easier — try all three.</p>
            </Reveal>
          </div>
          {/* Mobile: swipeable row. Tablet/desktop: two columns. */}
          <div className="mx-auto mt-8 flex max-w-7xl snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:px-8 md:grid md:grid-cols-2 md:overflow-visible lg:gap-5">
              {flavours
                .filter((x) => x.slug !== slug)
                .map((x) => (
                  <FlavourCard
                    key={x.slug}
                    flavour={x}
                    index={flavours.indexOf(x)}
                    tagline={shopFlavours[x.slug].tagline}
                    description={shopFlavours[x.slug].description}
                    cta="View Product"
                    href={`/shop/${x.slug}`}
                    shop
                    className="w-[86%] shrink-0 snap-center md:w-auto"
                  />
                ))}
          </div>
        </section>
      </main>
    </>
  );
}

function DetailCard({ title, delay, children }: { title: string; delay: number; children: React.ReactNode }) {
  return (
    <Reveal delay={delay} className="rounded-[1.5rem] bg-cream p-6 text-[0.95rem] leading-relaxed text-ink-muted">
      <h3 className="mb-2 font-poster text-2xl uppercase text-forest">{title}</h3>
      {children}
    </Reveal>
  );
}
