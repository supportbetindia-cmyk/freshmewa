"use client";

import { useEffect } from "react";
import {
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

/** Shared easing + springs so every section moves with the same character. */
export const ease = [0.22, 1, 0.36, 1] as const;
export const softSpring = { stiffness: 60, damping: 20, mass: 0.6 };

/** Stagger-friendly reveal: fade + rise. Use with `custom={delay}`. */
export const reveal = {
  hidden: { opacity: 0, y: 32 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease, delay },
  }),
};

/**
 * Pointer position normalised to -1..1 (0 = centre), smoothed by a spring.
 * Stays at 0 on touch devices and for reduced-motion users.
 */
export function useMouseParallax() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      x.set((e.clientX / innerWidth) * 2 - 1);
      y.set((e.clientY / innerHeight) * 2 - 1);
    };
    addEventListener("pointermove", onMove, { passive: true });
    return () => removeEventListener("pointermove", onMove);
  }, [reduced, x, y]);

  return { x: useSpring(x, softSpring), y: useSpring(y, softSpring) };
}

/** Maps a -1..1 pointer value to a pixel offset for a given layer depth. */
export function useDepth(v: MotionValue<number>, depth: number) {
  return useTransform(v, (n) => n * depth);
}
