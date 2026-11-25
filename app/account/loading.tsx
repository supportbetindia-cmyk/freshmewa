export default function AccountLoading() {
  return (
    <main className="pt-24 lg:pt-28" aria-busy="true" aria-label="Loading your account">
      <div className="border-b border-forest/10">
        <div className="mx-auto max-w-6xl px-5 pb-8 sm:px-8">
          <div className="h-12 w-56 animate-pulse rounded-xl bg-forest/10" />
        </div>
      </div>
      <div className="bg-cream-deep/50">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 pb-20 pt-8 sm:px-8 lg:grid-cols-[22rem_1fr] lg:gap-10 lg:pt-12">
          <div className="h-80 animate-pulse rounded-[1.5rem] bg-white/70" />
          <div className="min-h-[28rem] animate-pulse rounded-[1.5rem] bg-white/70" />
        </div>
      </div>
    </main>
  );
}
