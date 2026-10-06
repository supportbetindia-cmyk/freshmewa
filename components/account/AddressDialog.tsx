"use client";

import { useState } from "react";
import { useLenis } from "lenis/react";
import { ArrowLeft } from "lucide-react";
import { account, validateAddress, type AddressForm, type Profile } from "@/lib/account";
import { indianStates } from "@/lib/content";

const fields: (keyof AddressForm)[] = ["name", "phone", "email", "line", "line2", "locality", "landmark", "pincode", "city", "state"];

const box =
  "h-13 w-full rounded-xl border border-forest/20 bg-white px-4 text-[0.98rem] text-forest outline-none transition-[border-color,box-shadow] placeholder:text-ink-muted/70 focus:border-forest focus:ring-4 focus:ring-gold-soft/50 aria-[invalid=true]:border-chilli";

/**
 * "Add New Address" modal (native <dialog>: Esc to close, focus handled by the browser).
 * Open it with `ref.current?.showModal()` (pause Lenis first — the dialog resumes it on close).
 */
export default function AddressDialog({ profile, ref }: { profile: Profile | null; ref: React.Ref<HTMLDialogElement> }) {
  const [errors, setErrors] = useState<Partial<Record<keyof AddressForm, string>>>({});
  const lenis = useLenis();

  const close = (e: React.SyntheticEvent) => (e.currentTarget.closest("dialog") as HTMLDialogElement).close();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const f = Object.fromEntries(fields.map((k) => [k, String(data.get(k) ?? "").trim()])) as AddressForm;
    const found = validateAddress(f);
    setErrors(found);
    const firstBad = fields.find((k) => found[k]);
    if (firstBad) {
      (form.elements.namedItem(firstBad) as HTMLElement)?.focus();
      return;
    }
    // Grab the dialog first: saving can create the profile, which re-keys (remounts) this form.
    const dialog = form.closest("dialog") as HTMLDialogElement;
    form.reset();
    account.addAddress({ id: crypto.randomUUID(), ...f }, data.get("default") === "on");
    dialog.close();
  }

  const err = (k: keyof AddressForm) =>
    errors[k] ? (
      <p id={`addr-${k}-err`} className="mt-1 text-sm font-medium text-chilli">
        {errors[k]}
      </p>
    ) : null;
  const a11y = (k: keyof AddressForm, label: string) => ({
    name: k,
    "aria-label": label,
    "aria-invalid": !!errors[k],
    "aria-describedby": errors[k] ? `addr-${k}-err` : undefined,
  });

  return (
    <dialog
      ref={ref}
      aria-labelledby="add-address-title"
      data-lenis-prevent
      onClose={() => {
        setErrors({});
        lenis?.start();
      }}
      className="m-auto w-[min(100%-1.5rem,64rem)] max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-[1.75rem] bg-cream p-0 text-ink shadow-[0_40px_80px_-30px_rgba(30,52,24,0.6)] backdrop:bg-forest/45 backdrop:backdrop-blur-[2px]"
    >
      <div className="flex items-center gap-4 border-b border-forest/10 bg-white/70 px-5 py-5 sm:px-8">
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="grid size-12 place-items-center rounded-full border border-forest/20 text-forest hover:bg-forest hover:text-cream"
        >
          <ArrowLeft className="size-5" />
        </button>
        <h2 id="add-address-title" className="font-poster text-3xl leading-none text-forest">
          Add New Address
        </h2>
      </div>

      {/* key: refill contact defaults when the profile appears */}
      <form key={profile?.phone ?? "guest"} onSubmit={submit} noValidate className="px-5 py-6 sm:px-8 sm:py-7">
        <h3 className="font-semibold text-forest">Customer Info</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <div>
            <input {...a11y("name", "Name")} autoComplete="name" placeholder="Enter Name" defaultValue={profile?.name} className={box} />
            {err("name")}
          </div>
          <div>
            <input
              {...a11y("phone", "Mobile number")}
              type="tel"
              inputMode="numeric"
              maxLength={10}
              autoComplete="tel-national"
              placeholder="Mobile Number *"
              defaultValue={profile?.phone}
              className={box}
            />
            {err("phone")}
          </div>
          <div>
            <input
              {...a11y("email", "Email ID")}
              type="email"
              autoComplete="email"
              placeholder="Email ID *"
              defaultValue={profile?.email}
              className={box}
            />
            {err("email")}
          </div>
        </div>

        <h3 className="mt-7 font-semibold text-forest">Address Info</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <textarea
              {...a11y("line", "Full address")}
              rows={3}
              autoComplete="address-line1"
              placeholder="Full Address *"
              className={`${box} h-auto resize-none py-3`}
            />
            {err("line")}
          </div>
          <input
            {...a11y("line2", "Address line 2")}
            autoComplete="address-line2"
            placeholder="Address Line 2 (optional)"
            className={`${box} sm:col-span-6`}
          />
          <input {...a11y("locality", "Locality or area")} placeholder="Locality / Area (optional)" className={`${box} sm:col-span-2`} />
          <input {...a11y("landmark", "Landmark")} placeholder="Landmark (optional)" className={`${box} sm:col-span-2`} />
          <div className="sm:col-span-2">
            <input
              {...a11y("pincode", "Pin code")}
              inputMode="numeric"
              maxLength={6}
              autoComplete="postal-code"
              placeholder="Pin Code *"
              className={box}
            />
            {err("pincode")}
          </div>
          <div className="sm:col-span-3">
            <input {...a11y("city", "City")} autoComplete="address-level2" placeholder="City *" className={box} />
            {err("city")}
          </div>
          <div className="sm:col-span-3">
            <select {...a11y("state", "State")} autoComplete="address-level1" defaultValue="" className={`${box} invalid:text-ink-muted/70`} required>
              <option value="" disabled>
                State *
              </option>
              {indianStates.map((s) => (
                <option key={s} className="text-forest">
                  {s}
                </option>
              ))}
            </select>
            {err("state")}
          </div>
        </div>

        <label className="mt-5 flex w-fit cursor-pointer items-center gap-3 text-[0.98rem] text-forest">
          <input type="checkbox" name="default" className="size-5 rounded accent-forest" />
          Make Default address
        </label>

        <div className="mt-6 flex justify-center">
          <button type="submit" className="btn btn-primary h-14 w-full max-w-sm">
            Add Address
          </button>
        </div>
      </form>
    </dialog>
  );
}
