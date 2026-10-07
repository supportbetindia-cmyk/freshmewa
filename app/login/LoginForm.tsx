"use client";

import { useActionState, useState } from "react";
import { authClient } from "@/lib/auth/client";
import { emailLogin } from "./actions";

const field = "mt-1.5 h-12 w-full rounded-xl border border-forest/20 bg-white px-4 outline-none focus:border-forest focus:ring-4 focus:ring-gold-soft/50";

export default function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(emailLogin, null);
  const [googleError, setGoogleError] = useState("");
  const codeStep = state?.step === "code";

  async function google() {
    setGoogleError("");
    const { error } = await authClient.signIn.social({ provider: "google", callbackURL: next });
    if (error) setGoogleError("Google sign-in didn't work. Try the email code instead.");
  }

  return (
    <div className="w-full max-w-sm rounded-[1.75rem] border border-forest/10 bg-white p-6 sm:p-8">
      <h1 className="font-poster text-4xl text-forest">Log in</h1>
      <p className="mt-1 text-ink-muted">See your orders and saved addresses on any device.</p>

      <button type="button" onClick={google} className="btn btn-outline mt-6 w-full">
        Continue with Google
      </button>
      {googleError && <p role="alert" className="mt-2 text-sm font-medium text-chilli">{googleError}</p>}

      <p className="my-5 flex items-center gap-3 text-xs uppercase tracking-widest text-ink-muted before:h-px before:flex-1 before:bg-forest/15 after:h-px after:flex-1 after:bg-forest/15">
        or
      </p>

      <form action={action}>
        <input type="hidden" name="next" value={next} />
        {codeStep ? (
          <>
            <input type="hidden" name="email" value={state.email} />
            <p className="text-sm text-ink-muted">
              {state.sent ? "New code sent" : "We sent a 6-digit code"} to <strong className="text-forest">{state.email}</strong>.
            </p>
            <label className="mt-4 block text-sm font-semibold text-forest">
              Code
              <input name="otp" required autoFocus inputMode="numeric" autoComplete="one-time-code" pattern="\d{6}" maxLength={6}
                className={`${field} tracking-[0.5em]`} />
            </label>
          </>
        ) : (
          <label className="block text-sm font-semibold text-forest">
            Email
            <input name="email" type="email" required autoComplete="email" defaultValue={state?.email} className={field} />
          </label>
        )}

        {state?.error && <p role="alert" className="mt-3 text-sm font-medium text-chilli">{state.error}</p>}

        <button type="submit" disabled={pending} className="btn btn-primary mt-5 w-full disabled:opacity-60">
          {pending ? "Please wait…" : codeStep ? "Log in" : "Email me a code"}
        </button>

        {codeStep && (
          <div className="mt-3 flex justify-between text-sm">
            <a href="/login" className="text-forest hover:underline">Use another email</a>
            <button name="resend" formNoValidate disabled={pending} className="text-forest hover:underline">Resend code</button>
          </div>
        )}
      </form>
    </div>
  );
}