import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="FreshMewa home"
      className={`group inline-flex items-center gap-2 text-forest ${className}`}
    >
      <svg viewBox="0 0 32 32" className="size-7 shrink-0" aria-hidden>
        <circle cx="16" cy="16" r="15" className="fill-forest" />
        {/* stylised almond with a pistachio leaf */}
        <path d="M16 7c4.5 3.2 5.6 9.8 0 18-5.6-8.2-4.5-14.8 0-18z" className="fill-gold-soft" />
        <path d="M16 11v10" className="stroke-forest" strokeWidth="1" strokeLinecap="round" />
        <path
          d="M20.5 8.5c2.6-.3 4.3.6 5 2.2-1.9 1-4 .8-5-2.2z"
          className="fill-pista-soft transition-transform duration-500 ease-premium group-hover:-rotate-12"
          style={{ transformOrigin: "20.5px 8.5px" }}
        />
      </svg>
      <span className="font-display text-[1.45rem] leading-none tracking-tight">
        Fresh<span className="italic text-gold">Mewa</span>
      </span>
    </Link>
  );
}
