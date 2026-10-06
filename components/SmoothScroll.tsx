"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "framer-motion";

/** Lenis smooth scrolling for the whole page; native scroll for reduced-motion users. */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  if (reduced) return children;
  return (
    <ReactLenis root options={{ lerp: 0.12, anchors: { offset: -80 }, autoRaf: true }}>
      {children}
    </ReactLenis>
  );
}
