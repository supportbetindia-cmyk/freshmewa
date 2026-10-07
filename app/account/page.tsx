import type { Metadata } from "next";
import AccountView from "@/components/account/AccountView";
import { requireUser } from "@/lib/auth/users";
import { listMyOrders } from "@/lib/db/orders";

export const metadata: Metadata = {
  title: "My Account — Fresh Mewa",
  robots: { index: false },
};

export default async function AccountPage() {
  const user = await requireUser("/account");
  const orders = await listMyOrders();

  return (
    <main className="pt-24 lg:pt-28">
      <AccountView user={{ name: user.name, email: user.email }} orders={orders} />
    </main>
  );
}
