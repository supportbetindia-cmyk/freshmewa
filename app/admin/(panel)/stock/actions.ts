"use server";

import { revalidatePath } from "next/cache";
import { allSkus, setStock } from "@/lib/db/inventory";

export async function saveStock(formData: FormData) {
  const sku = String(formData.get("sku") ?? "");
  const qty = Number(formData.get("quantity"));
  if (!allSkus().includes(sku) || !Number.isInteger(qty) || qty < 0 || qty > 100000) return;
  await setStock(sku, qty);
  revalidatePath("/admin/stock");
}
