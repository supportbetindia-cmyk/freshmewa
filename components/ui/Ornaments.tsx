/** Veneer Extras glyph — decorative only. "7" flourish, "z" star, "6" scalloped seal. */
export function Ornament({ glyph, className = "" }: { glyph: string; className?: string }) {
  return (
    <span aria-hidden className={`font-ornament leading-none ${className}`}>
      {glyph}
    </span>
  );
}
