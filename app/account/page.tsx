import type { Metadata } from "next";
import AccountView from "@/components/account/AccountView";
import { requireUser } from "@/lib/auth/users";
import { listMyOrders } from "@/lib/db/orders";
import { listMyAddresses } from "@/lib/db/addresses";

export const metadata: Metadata = {
  title: "My Account — Fresh Mewa",
  robots: { index: false },
};

export default async function AccountPage() {
  const user = await requireUser("/account");
  const [orders, addresses] = await Promise.all([listMyOrders(), listMyAddresses()])

  return (
    <main className="pt-24 lg:pt-28">
      <AccountView user={{ name: user.name, email: user.email }} orders={orders} addresses={addresses} />
    </main>
  );
}
