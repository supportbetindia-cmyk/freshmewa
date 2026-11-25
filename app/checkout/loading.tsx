export default function CheckoutLoading() {
  return (
    <main className="pb-16 pt-24 lg:pt-28" aria-busy="true" aria-label="Loading checkout">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="h-4 w-40 animate-pulse rounded bg-forest/10" />
        <div className="mb-6 mt-4 h-12 w-64 animate-pulse rounded-xl bg-forest/10" />
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:gap-10">
          <div className="h-[32rem] animate-pulse rounded-[1.5rem] bg-white/70" />
          <div className="h-80 animate-pulse rounded-[1.5rem] bg-white/70" />
        </div>
      </div>
    </main>
  );
}
