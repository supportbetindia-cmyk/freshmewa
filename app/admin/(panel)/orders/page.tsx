import Link from "next/link";
import { formatINR } from "@/lib/content";
import { orderStatuses } from "@/lib/orders";
import { listOrders } from "@/lib/db/orders";

const date = (d: Date) =>
  d.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

export default async function Orders({ searchParams }: PageProps<"/admin/orders">) {
  const { status } = await searchParams;
  const filter = orderStatuses.find((s) => s === status);
  const rows = await listOrders(filter);

  return (
    <>
      <h1 className="font-poster text-4xl text-forest">Orders</h1>

      <nav className="mt-4 flex flex-wrap gap-2 text-sm font-semibold">
        {[undefined, ...orderStatuses].map((s) => (
          <Link
            key={s ?? "all"}
            href={s ? `/admin/orders?status=${s}` : "/admin/orders"}
            className={`rounded-full px-4 py-1.5 capitalize ${s === filter ? "bg-forest text-cream" : "bg-white text-forest hover:bg-cream"}`}
          >
            {s ?? "All"}
          </Link>
        ))}
      </nav>

      {rows.length === 0 ? (
        <p className="mt-10 text-center text-ink-muted">No orders here yet.</p>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-2xl border border-forest/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream text-forest">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Placed</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id} className="border-t border-forest/10 hover:bg-cream/60">
                  <td className="px-4 py-3 font-semibold text-forest">
                    <Link href={`/admin/orders/${o.id}`} className="underline decoration-forest/25 underline-offset-4 hover:decoration-forest">{o.id}</Link>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-ink-muted">{date(o.createdAt)}</td>
                  <td className="px-4 py-3">{o.name}<span className="block text-ink-muted">+91 {o.phone}</span></td>
                  <td className="px-4 py-3">{o.address.city}, {o.address.pincode}</td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums">{formatINR(o.total)}</td>
                  <td className="px-4 py-3 capitalize">{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}