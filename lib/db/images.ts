import "server-only";
import { eq } from "drizzle-orm";
import { db } from ".";
import { blogImages } from "./schema";

export const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

/** Real file signatures — the browser's claimed type is not trusted. */
const SIGNATURES: [string, number[]][] = [
  ["image/jpeg", [0xff, 0xd8, 0xff]],
  ["image/png", [0x89, 0x50, 0x4e, 0x47]],
  ["image/gif", [0x47, 0x49, 0x46, 0x38]],
  ["image/webp", [0x52, 0x49, 0x46, 0x46]],
];

export function detectImage(bytes: Uint8Array): string | null {
  for (const [mime, sig] of SIGNATURES) {
    if (sig.every((b, i) => bytes[i] === b)) {
      if (mime === "image/webp" && !(bytes[8] === 0x57 && bytes[9] === 0x45)) continue; // RIFF but not WEBP
      return mime;
    }
  }
  return null;
}

export async function saveBlogImage(mime: string, bytes: Uint8Array) {
  const [row] = await db
    .insert(blogImages)
    .values({ mime, data: Buffer.from(bytes).toString("base64") })
    .returning({ id: blogImages.id });
  return row.id;
}

export async function getBlogImage(id: string) {
  const [row] = await db.select().from(blogImages).where(eq(blogImages.id, id)).limit(1);
  return row;
}
