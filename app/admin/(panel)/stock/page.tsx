import { flavours, packs } from "@/lib/content";
import { LOW_STOCK, listStock, skuOf } from "@/lib/db/inventory";
import { saveStock } from "./actions";

export default async function StockPage() {
  const stock = await listStock();

  return (
    <>
      <h1 className="font-poster text-4xl text-forest">Stock</h1>
      <p className="mt-2 text-ink-muted">
        Packs on the shelf. Orders take packs when placed and return them when cancelled. Products at 0 show &ldquo;Sold out&rdquo; on the site.
        Low stock is {LOW_STOCK} or fewer.
      </p>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {flavours.map((f) => (
          <section key={f.slug} className="rounded-2xl border border-forest/10 bg-white p-5">
            <h2 className="font-semibold text-forest">{f.name}</h2>
            <ul className="mt-3 divide-y divide-forest/10">
              {packs.map((p) => {
                const sku = skuOf(f.slug, p.id);
                const qty = stock[sku] ?? 0;
                return (
                  <li key={sku} className="py-3">
                    <form action={saveStock} className="flex flex-wrap items-center gap-3">
                      <input type="hidden" name="sku" value={sku} />
                      <span className="w-20 font-medium text-forest">{p.label}</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${qty === 0 ? "bg-chilli-soft text-chilli" : qty <= LOW_STOCK ? "bg-gold-soft/50 text-forest" : "bg-mint-soft text-mint"}`}>
                        {qty === 0 ? "Sold out" : qty <= LOW_STOCK ? `Low: ${qty}` : `${qty} in stock`}
                      </span>
                      <span className="ml-auto flex items-center gap-2">
                        <label className="sr-only" htmlFor={`qty-${sku}`}>New count for {f.name} {p.label}</label>
                        <input id={`qty-${sku}`} name="quantity" type="number" min={0} max={100000} step={1} defaultValue={qty} required
                          className="h-10 w-24 rounded-xl border border-forest/20 bg-white px-3 outline-none focus:border-forest focus:ring-4 focus:ring-gold-soft/50" />
                        <button type="submit" className="btn btn-outline h-10 bg-white px-4 text-forest">Save</button>
                      </span>
                    </form>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
