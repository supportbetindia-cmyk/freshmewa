import type { Metadata } from "next";
import AccountView from "@/components/account/AccountView";

export const metadata: Metadata = {
  title: "My Account — Fresh Mewa",
  robots: { index: false },
};

export default function AccountPage() {
  return (
    <main className="pt-24 lg:pt-28">
      <AccountView />
    </main>
  );
}
