import { getStock } from "@/lib/db/inventory";

export const dynamic = "force-dynamic";

/** Public stock counts for the storefront. Cached 30 s at the edge; checkout re-checks stock on the server anyway. */
export async function GET() {
  return Response.json(await getStock(), {
    headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" },
  });
}
