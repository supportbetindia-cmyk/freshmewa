import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder } from "@/lib/db/orders";
import { formatINR } from "@/lib/content";
import { formatAddress } from "@/lib/orders";
import StatusForm from "./StatusForm";

export default async function OrderDetails({ params }: PageProps<"/admin/orders/[id]">) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  const placed = order.createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" });

  return (
    <>
      <Link href="/admin/orders" className="text-sm font-semibold text-forest hover:underline">← All orders</Link>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-poster text-4xl text-forest">{order.id}</h1>
          <p className="text-ink-muted">{placed} · Cash on Delivery</p>
        </div>

        <StatusForm key={order.id} id={order.id} status={order.status} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-forest/10 bg-white p-5">
          <h2 className="font-semibold text-forest">Items</h2>
          <ul className="mt-3 divide-y divide-forest/10">
            {order.items.map((i) => (
              <li key={`${i.slug}:${i.pack}`} className="flex justify-between gap-3 py-2">
                <span>{i.name} · {i.packLabel} × {i.qty}</span>
                <span className="tabular-nums">{formatINR(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-3 space-y-1 border-t border-forest/10 pt-3 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd className="tabular-nums">{formatINR(order.subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Delivery</dt><dd className="tabular-nums">{order.delivery ? formatINR(order.delivery) : "Free"}</dd></div>
            <div className="flex justify-between text-base font-bold text-forest"><dt>Total to collect</dt><dd className="tabular-nums">{formatINR(order.total)}</dd></div>
          </dl>
        </section>

        <section className="rounded-2xl border border-forest/10 bg-white p-5">
          <h2 className="font-semibold text-forest">Customer</h2>
          <p className="mt-2">{order.name}</p>
          <p><a href={`tel:+91${order.phone}`} className="text-forest underline">+91 {order.phone}</a></p>
          {order.email && <p className="text-ink-muted">{order.email}</p>}
          <h2 className="mt-4 font-semibold text-forest">Deliver to</h2>
          <p className="mt-2 leading-relaxed">{formatAddress(order.address)}</p>
        </section>
      </div>
    </>
  );
}
