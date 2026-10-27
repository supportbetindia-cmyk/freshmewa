"use server";
import { revalidatePath } from "next/cache";
import { addMyAddress, removeMyAddress, setMyDefaultAddress } from "@/lib/db/addresses";
import { validateAddress, type AddressForm } from "@/lib/orders";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";

/** Ends the login session (deletes the neon_auth.session row + clears the cookies). */
export async function logOut() {
  await auth.signOut();
  redirect("/");
}



const addressFields: (keyof AddressForm)[] = ["name", "phone", "email", "line", "line2", "locality", "landmark", "pincode", "city", "state"];

/** "Add New Address". Checks again on the server: the dialog's check runs in the browser, which anyone can skip. */
export async function saveAddress(formData: FormData): Promise<{ errors?: Partial<Record<keyof AddressForm, string>>; error?: string }> {
  const f = Object.fromEntries(addressFields.map((k) => [k, String(formData.get(k) ?? "").trim()])) as AddressForm;
  const errors = validateAddress(f);
  if (Object.keys(errors).length) return { errors };

  try {
    await addMyAddress(f, formData.get("default") === "on");
  } catch (err) {
    console.error("saveAddress failed", err);
    return { error: "Couldn't save the address. Please try again." };
  }
  revalidatePath("/account");
  return {};
}

export async function makeDefaultAddress(formData: FormData) {
  await setMyDefaultAddress(String(formData.get("id") ?? ""));
  revalidatePath("/account");
}

export async function deleteAddress(formData: FormData) {
  await removeMyAddress(String(formData.get("id") ?? ""));
  revalidatePath("/account");
}
