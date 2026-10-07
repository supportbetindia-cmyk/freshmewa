"use client";

import { useActionState } from "react";
import { orderStatuses, type OrderStatus } from "@/lib/orders";
import { updateStatus } from "../actions";

export default function StatusForm({ id, status }: { id: string; status: OrderStatus }) {
  const [state, action, pending] = useActionState(updateStatus, null);

  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <div className="flex gap-2">
        <select name="status" defaultValue={status} aria-label="Order status" disabled={pending}
          className="h-11 rounded-xl border border-forest/20 bg-white px-3 capitalize text-forest disabled:opacity-60">
          {orderStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button type="submit" disabled={pending} className="btn btn-primary h-11 disabled:opacity-60">
          {pending ? "Updating…" : "Update"}
        </button>
      </div>
      {state?.error && <p role="alert" className="mt-2 max-w-sm text-sm text-chilli">{state.error}</p>}
      {state?.success && <p role="status" className="mt-2 text-sm text-forest">{state.success}</p>}
    </form>
  );
}
