import Link from "next/link";

export default function OrderNotFound() {
  return (
    <section className="rounded-2xl border border-forest/10 bg-white p-6">
      <h1 className="font-poster text-4xl text-forest">Order not found</h1>
      <p className="mt-3 text-ink-muted">This order does not exist or is no longer available.</p>
      <Link href="/admin/orders" className="btn btn-primary mt-5">Back to orders</Link>
    </section>
  );
}
