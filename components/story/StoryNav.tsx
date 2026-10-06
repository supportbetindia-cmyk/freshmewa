"use client";

import { useEffect, useState } from "react";
import { m, useScroll } from "framer-motion";
import { storyChapters } from "@/lib/content";

/** Thin gold reading-progress bar pinned to the very top of the window. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <m.div
      aria-hidden
      style={{ scaleX: scrollYProgress }}
      className="fixed inset-x-0 top-0 z-[55] h-1 origin-left bg-gold"
    />
  );
}

/** Sticky chapter list (desktop). Highlights the chapter currently being read. */
export function ChapterNav() {
  const [active, setActive] = useState(storyChapters[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      // A chapter counts as "current" when it crosses the upper third of the screen.
      { rootMargin: "-30% 0px -60% 0px" },
    );
    storyChapters.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="Chapters" className="sticky top-28 hidden lg:block">
      <p className="font-hand text-sm font-bold uppercase tracking-[0.18em] text-gold">The chapters</p>
      <ol className="mt-3 space-y-0.5 border-l-2 border-dashed border-forest/15">
        {storyChapters.map((c, i) => {
          const on = c.id === active;
          return (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                aria-current={on ? "true" : undefined}
                className={`-ml-0.5 flex gap-2 border-l-2 py-1.5 pl-4 font-hand text-[0.95rem] leading-snug transition-colors duration-300 ${
                  on ? "border-forest font-bold text-forest" : "border-transparent text-ink-muted hover:text-forest"
                }`}
              >
                <span className="tabular-nums opacity-60">{String(i + 1).padStart(2, "0")}</span>
                {c.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
