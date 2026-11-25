import JsonLd from "@/components/JsonLd";
import type { Metadata } from "next";
import Script from "next/script";
import { Comic_Neue, Fraunces, Manrope, Tiro_Devanagari_Hindi } from "next/font/google";
import localFont from "next/font/local";
import { domAnimation, LazyMotion, MotionConfig } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import "./globals.css";
import HideOnAdmin from "@/components/HideOnAdmin";
import { siteUrl } from "@/lib/content";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  preload: false,
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const comicNeue = Comic_Neue({
  variable: "--font-comic",
  subsets: ["latin"],
  weight: ["400", "700"],
  preload: false,
});

const tiro = Tiro_Devanagari_Hindi({
  variable: "--font-tiro",
  subsets: ["devanagari"],
  weight: "400",
  preload: false,
});

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
  metadataBase: new URL(siteUrl),
  title: "Fresh Mewa — Roasted Makhana, Made for Every Day",
  description:
    "Crunchy, flavourful roasted makhana in Pudina, Salt & Pepper and Peri Peri. Made for chai breaks, desk snacking, travel and movie nights.",
  openGraph: { siteName: "Fresh Mewa", locale: "en_IN", type: "website" },
  twitter: { card: "summary_large_image" },
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
  "logo": "https://www.bestfreshmewa.com/images/logo.webp",
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
        <JsonLd data={websiteSchema} />
        <JsonLd data={organizationSchema} />
        <noscript>
          <style>{"[style*='opacity:0']{opacity:1!important;transform:none!important}"}</style>
        </noscript>
      </head>
      <body>
        <Script src="https://www.googletagmanager.com/gtm.js?id=GTM-57ZBCQDP" strategy="lazyOnload" />
        <Script id="freshmewa-analytics" strategy="lazyOnload">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());`}
        </Script>
        <LazyMotion features={domAnimation} strict>
          <MotionConfig reducedMotion="user">
            <HideOnAdmin><Navbar /></HideOnAdmin>
            {children}
            <HideOnAdmin><Footer /></HideOnAdmin>
          </MotionConfig>
        </LazyMotion>
      </body>
    </html>
  );
}
