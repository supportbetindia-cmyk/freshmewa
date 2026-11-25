"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import LoginForm from "@/app/login/LoginForm";

/** The login form in a pop-up, opened from the navbar. Stays on the current page; a successful login reloads it. */
export default function AuthDialog({ open, next, signup, onClose }: { open: boolean; next: string; signup: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={signup ? "Create your account" : "Log in"}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current?.close()} // click on the backdrop closes it
      className="m-auto bg-transparent p-4 backdrop:bg-forest/40 backdrop:backdrop-blur-[2px]"
    >
      <div className="relative">
        <button type="button" onClick={() => ref.current?.close()} aria-label="Close"
          className="absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-full bg-white text-forest shadow hover:bg-forest hover:text-cream">
          <X className="size-5" />
        </button>
        {open && <LoginForm next={next} signup={signup} />}
      </div>
    </dialog>
  );
}
