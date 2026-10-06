"use client";

import { m, type HTMLMotionProps } from "framer-motion";
import { ease } from "@/lib/motion";

/** Fade + rise once when scrolled into view. Transform/opacity only. */
export default function Reveal({
  delay = 0,
  y = 28,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  return (
    <m.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease, delay }}
      {...props}
    />
  );
}
