import { getUser } from "@/lib/auth/users";
import { detectImage, MAX_IMAGE_BYTES, saveBlogImage } from "@/lib/db/images";

/** Admin-only upload used by the blog editor. Returns the URL to put in the post. */
export async function POST(req: Request) {
  const user = await getUser();
  if (user?.role !== "admin") return Response.json({ error: "Only the admin can upload." }, { status: 403 });

  const file = (await req.formData()).get("file");
  if (!(file instanceof File)) return Response.json({ error: "No file." }, { status: 400 });
  if (file.size > MAX_IMAGE_BYTES) return Response.json({ error: "Image is over 3 MB. Please resize it first." }, { status: 413 });

  const bytes = new Uint8Array(await file.arrayBuffer());
  const mime = detectImage(bytes);
  if (!mime) return Response.json({ error: "Only JPG, PNG, WebP or GIF images." }, { status: 415 });

  const id = await saveBlogImage(mime, bytes);
  return Response.json({ url: `/api/blog-images/${id}` });
}
