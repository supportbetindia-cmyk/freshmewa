import type { Metadata } from "next";
import { Comic_Neue, Fraunces, Manrope, Tiro_Devanagari_Hindi } from "next/font/google";
import localFont from "next/font/local";
import { domAnimation, LazyMotion, MotionConfig } from "framer-motion";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
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
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${manrope.variable} ${tiro.variable} ${veneer.variable} ${veneerExtras.variable} ${comicNeue.variable} antialiased`}
    >
      <body>
        {/* LazyMotion + `m` components: only the animation/hover/in-view features ship. `strict` blocks full `motion.*` imports. */}
        <LazyMotion features={domAnimation} strict>
          <MotionConfig reducedMotion="user">
            <SmoothScroll>
              <Navbar />
              {children}
              <Footer />
            </SmoothScroll>
          </MotionConfig>
        </LazyMotion>
      </body>
    </html>
  );
}
