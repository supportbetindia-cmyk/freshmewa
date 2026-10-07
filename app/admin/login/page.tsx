"use client";

import { useActionState } from "react";
import { signIn } from "./actions";

export default function AdminLogin() {
  const [state, action, pending] = useActionState(signIn, null);

  return (
    <main className="grid min-h-[70vh] place-items-center bg-cream-deep/50 px-5 py-16">
      <form action={action} className="w-full max-w-sm rounded-[1.75rem] border border-forest/10 bg-white p-6 sm:p-8">
        <h1 className="font-poster text-4xl text-forest">Admin login</h1>

        <label className="mt-6 block text-sm font-semibold text-forest">
          Email
          <input name="email" type="email" autoComplete="username" required
            className="mt-1.5 h-12 w-full rounded-xl border border-forest/20 px-4 outline-none focus:border-forest focus:ring-4 focus:ring-gold-soft/50" />
        </label>

        <label className="mt-4 block text-sm font-semibold text-forest">
          Password
          <input name="password" type="password" autoComplete="current-password" required
            className="mt-1.5 h-12 w-full rounded-xl border border-forest/20 px-4 outline-none focus:border-forest focus:ring-4 focus:ring-gold-soft/50" />
        </label>

        {state?.error && <p role="alert" className="mt-4 text-sm font-medium text-chilli">{state.error}</p>}

        <button type="submit" disabled={pending} className="btn btn-primary mt-6 w-full disabled:opacity-60">
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}