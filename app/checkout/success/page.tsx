import type { Metadata } from "next";
import OrderConfirmation from "@/components/checkout/OrderConfirmation";

export const metadata: Metadata = {
  title: "Order placed — Fresh Mewa",
  robots: { index: false },
};

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order = "" } = await searchParams;
  return (
    <main className="px-5 pb-16 pt-28 sm:px-8 lg:pt-32">
      <OrderConfirmation id={order} />
    </main>
  );
}
