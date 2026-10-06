import { flavours } from "@/lib/content";
import MakhanaPouch from "./MakhanaPouch";

/** The three flavour pouches fanned out, gently floating (CSS keyframes, transform only). */
export default function PouchTrio({ priority = false, className = "" }: { priority?: boolean; className?: string }) {
  return (
    <div className={`relative mx-auto flex w-full max-w-md items-end justify-center ${className}`}>
      {flavours.map((f, i) => (
        <div
          key={f.slug}
          className={`w-1/3 animate-[float_6s_ease-in-out_infinite] motion-reduce:animate-none ${
            i === 1 ? "z-10 -mx-[6%] w-[40%] [animation-delay:-2s]" : i === 0 ? "-rotate-6 [animation-delay:-4s]" : "rotate-6"
          }`}
        >
          <MakhanaPouch flavour={f} priority={priority} sizes="(min-width: 1024px) 12vw, 33vw" />
        </div>
      ))}
    </div>
  );
}
