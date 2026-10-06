"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m, useMotionValueEvent, useScroll } from "framer-motion";
import { useLenis } from "lenis/react";
import { Heart, Menu, ShoppingBag, User, X } from "lucide-react";
import Logo from "./Logo";
import logo from "@/public/images/logo.webp";
import CartDrawer from "./CartDrawer";
import { cart, countItems, useCart } from "@/lib/cart";
import { ease } from "@/lib/motion";
import { navLinks } from "@/lib/content";


const iconBtn =
  "relative grid size-10 place-items-center rounded-full text-forest transition-colors hover:bg-forest/5 focus-visible:outline-2 focus-visible:outline-gold";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const lenis = useLenis();
  const pathname = usePathname();
  const { lines, open: cartOpen } = useCart();
  const cartCount = countItems(lines);
  const locked = open || cartOpen;

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  // Lock page scroll + close on Escape while the menu or cart drawer is open.
  useEffect(() => {
    if (!locked) return;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      cart.close();
    };
    addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      lenis?.start();
      removeEventListener("keydown", onKey);
    };
  }, [locked, lenis]);

  // Close the drawer. Same-page "/#section" links glide there (Lenis is paused while the
  // drawer is open); everything else is a normal route change.
  const goTo = (e: React.MouseEvent, href: string) => {
    setOpen(false);
    const [path, hash] = href.split("#");
    if (!hash || path !== pathname) return;
    e.preventDefault();
    if (lenis) {
      lenis.start();
      lenis.scrollTo(`#${hash}`, { offset: -80 });
    } else {
      document.getElementById(hash)?.scrollIntoView();
    }
  };

  return (
    <>
      <m.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease, delay: 0.2 }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4"
      >
        <nav
          aria-label="Main"
          className={`mx-auto flex auto max-w-7xl items-center justify-between rounded-full px-3 transition-[background-color,box-shadow,border-color] duration-500 ease-premium sm:px-5 ${
            scrolled
              ? "border border-white/60 bg-cream/90 shadow-[0_8px_30px_-12px_rgba(30,52,24,0.18)] backdrop-blur-sm"
              : "border border-transparent"
          }`}
        >
          {/* Mobile: menu */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(true)}
            className={`${iconBtn}`}
          >
            <Menu className="size-5" strokeWidth={1.6} />
          </button>

          <Link href="/" aria-label="Fresh Mewa home">
            <Image src={logo} alt="Fresh Mewa" sizes="100px" loading="eager" className="h-auto w-25" />
          </Link>

          <div className="flex items-center gap-0.5">
            <Link href="/account" aria-label="My account" className={iconBtn}>
              <User className="size-[1.15rem]" strokeWidth={1.6} />
            </Link>
            <button type="button" onClick={cart.open} aria-label={`Open cart, ${cartCount} items`} className={iconBtn}>
              <ShoppingBag className="size-[1.15rem]" strokeWidth={1.6} />
              <AnimatePresence initial={false} mode="popLayout">
                <m.span
                  key={cartCount}
                  initial={{ scale: 1.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 28 }}
                  className="absolute right-0.5 top-0.5 grid size-[1.1rem] place-items-center rounded-full bg-forest text-[0.62rem] font-semibold text-cream"
                >
                  {cartCount}
                </m.span>
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </m.header>

      <AnimatePresence>
        {open && (
          <>
            <m.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[60] bg-forest/30 backdrop-blur-[2px]"
            />
            <m.div
              key="drawer"
              id="mobile-nav"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.6, ease }}
              data-lenis-prevent
              className="grain fixed inset-y-0 left-0 z-[70] flex w-[min(86vw,380px)] flex-col overflow-hidden bg-cream px-6 pb-8 pt-6"
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className={iconBtn}
                  autoFocus
                >
                  <X className="size-5" strokeWidth={1.6} />
                </button>
              </div>

              <ul className="mt-14 space-y-1">
                {navLinks.map((l, i) => (
                  <m.li
                    key={l.href}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease, delay: 0.15 + i * 0.06 }}
                  >
                    <Link
                      href={l.href}
                      onClick={(e) => goTo(e, l.href)}
                      className="flex items-baseline justify-between border-b border-forest/10 py-4 font-display text-3xl text-forest"
                    >
                      {l.label}
                      <span className="font-sans text-xs text-ink-muted">0{i + 1}</span>
                    </Link>
                  </m.li>
                ))}
              </ul>

              <div className="mt-auto flex gap-3 text-sm font-medium text-forest">
                <Link href="/account" onClick={() => setOpen(false)} className="flex flex-1 items-center justify-center gap-2 rounded-full border border-forest/15 py-3">
                  <User className="size-4" strokeWidth={1.6} /> Account
                </Link>
                <Link href="/wishlist" onClick={() => setOpen(false)} className="flex flex-1 items-center justify-center gap-2 rounded-full border border-forest/15 py-3">
                  <Heart className="size-4" strokeWidth={1.6} /> Wishlist
                </Link>
              </div>
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-10 -right-6 font-deva text-[11rem] leading-none text-gold/10"
              >
                मेवा
              </span>
            </m.div>
          </>
        )}
      </AnimatePresence>
      <CartDrawer />
    </>
  );
}
