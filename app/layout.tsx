import type { Metadata } from "next";
import Script from "next/script";
import { Comic_Neue, Fraunces, Manrope, Tiro_Devanagari_Hindi } from "next/font/google";
import localFont from "next/font/local";
import { domAnimation, LazyMotion, MotionConfig } from "framer-motion";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import "./globals.css";
import HideOnAdmin from "@/components/HideOnAdmin";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  preload: false, // ~82 KB; above the fold it's only the small "Made for Every Day." line, so don't let it compete with the hero
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

// Handwritten voice for the Our Story page.
const comicNeue = Comic_Neue({
  variable: "--font-comic",
  subsets: ["latin"],
  weight: ["400", "700"],
  preload: false, // only the Our Story page + one pill use it
});

const tiro = Tiro_Devanagari_Hindi({
  variable: "--font-tiro",
  subsets: ["devanagari"],
  weight: "400",
  preload: false, // decorative watermark in the mobile menu only
});

// Subset WOFF2 builds of the Veneer files in /public/fonts (see app/fonts). Veneer = capitals, digits, punctuation, ₹ only.
const veneer = localFont({
  src: "./fonts/Veneer.woff2",
  variable: "--font-veneer",
  display: "swap",
});

const veneerExtras = localFont({
  src: "./fonts/VeneerExtras.woff2",
  variable: "--font-veneer-extras",
  display: "block",
  preload: false,
});

export const metadata: Metadata = {
  title: "Fresh Mewa — Roasted Makhana, Made for Every Day",
  description:
    "Crunchy, flavourful roasted makhana in Pudina, Salt & Pepper and Peri Peri. Made for chai breaks, desk snacking, travel and movie nights.",
  verification: {
    google: "T8Z6lB0rWeHbSKEmokhdtblt-psIQsMAi0fNawzgypo",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Best Fresh Mewa",
  "alternateName": ["Fresh Mewa"],
  "url": "https://www.bestfreshmewa.com/",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Fresh Mewa",
  "alternateName": "Fresh Mewa",
  "url": "https://www.bestfreshmewa.com/",
  "logo": "https://www.bestfreshmewa.com/_next/static/media/logo.05ceddf3.webp",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "9999918877",
    "contactType": "sales",
    "contactOption": "TollFree",
    "areaServed": "IN",
    "availableLanguage": ["en", "Hindi"],
  },
  "sameAs": "https://www.instagram.com/fresh.mewa",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${manrope.variable} ${tiro.variable} ${veneer.variable} ${veneerExtras.variable} ${comicNeue.variable} antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body>
        <Script
          async
          src="https://www.googletagmanager.com/gtm.js?id=GTM-57ZBCQDP"
          strategy="afterInteractive"
        />
        <Script id="freshmewa-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());`}
        </Script>
        {/* LazyMotion + `m` components: only the animation/hover/in-view features ship. `strict` blocks full `motion.*` imports. */}
        <LazyMotion features={domAnimation} strict>
          <MotionConfig reducedMotion="user">
            <SmoothScroll>
              <HideOnAdmin><Navbar /></HideOnAdmin>
              {children}
              <HideOnAdmin><Footer /></HideOnAdmin>
            </SmoothScroll>
          </MotionConfig>
        </LazyMotion>
      </body>
    </html>
  );
}
