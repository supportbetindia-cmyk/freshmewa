"use server";

import { revalidatePath } from "next/cache";
import { setOrderStatus } from "@/lib/db/orders";
import { orderStatuses } from "@/lib/orders";

export type UpdateStatusState = { error?: string; success?: string } | null;

export async function updateStatus(_previous: UpdateStatusState, formData: FormData): Promise<UpdateStatusState> {
  const id = formData.get("id");
  const status = orderStatuses.find((s) => s === formData.get("status"));
  if (typeof id !== "string" || !id.trim() || !status) {
    return { error: "Choose a valid order and status, then try again." };
  }

  const result = await setOrderStatus(id, status);
  if (!result) return { error: "This order no longer exists. Return to the orders list." };
  if ("short" in result) return { error: "Not enough packs in stock to reopen this order. Add stock first." };
  revalidatePath("/admin/orders", "layout");
  return { success: "Order status updated." };
}
