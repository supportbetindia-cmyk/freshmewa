export function Ornament({ glyph, className = "" }: { glyph: string; className?: string }) {
  return (
    <span aria-hidden className={`font-ornament leading-none ${className}`}>
      {glyph}
    </span>
  );
}
