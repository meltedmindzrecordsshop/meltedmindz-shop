import { NextResponse } from "next/server";
import { listSyncProducts, getSyncProductDetail } from "@/lib/printful";

// Printful has no product-description field, so descriptions are
// maintained here locally, keyed by the slug you set as each Sync
// Product's External ID in the Printful dashboard. Add a line here
// when you add a new product — everything else (price, variants,
// availability, thumbnail) comes from Printful automatically.
const DESCRIPTIONS: Record<string, string> = {
  "melted-mindz-t-shirt":
    "Classic fit tee with the Melted Mindz Records logo.",
  "melted-mindz-hoodie":
    "Heavyweight hoodie with the Melted Mindz Records logo.",
};

export async function GET() {
  try {
    const summaries = await listSyncProducts();

    const products = await Promise.all(
      summaries.map(async (summary) => {
        const { syncProduct, variants } = await getSyncProductDetail(
          summary.id
        );

        const productKey = syncProduct.external_id ?? String(syncProduct.id);

        return {
          productKey,
          name: syncProduct.name,
          description: DESCRIPTIONS[productKey] ?? "",
          thumbnail: syncProduct.thumbnail_url,
          variants: variants.map((v) => ({
            size: v.size,
            retailPrice: v.retail_price,
            available: v.availability_status === "active",
          })),
        };
      })
    );

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Failed to fetch Printful products:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch products from Printful.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}