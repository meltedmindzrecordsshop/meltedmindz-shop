// app/api/printify/products/route.ts

import { NextResponse } from "next/server";

interface PrintifyVariant {
  id: number;
  title: string;
  sku: string;
  price: number;
  is_enabled: boolean;
}

interface PrintifyProduct {
  id: string;
  title: string;
  variants: PrintifyVariant[];
}

interface PrintifyProductsResponse {
  data: PrintifyProduct[];
}

interface SimplifiedVariant {
  variantId: number;
  variantTitle: string;
  sku: string;
  price: number;
  enabled: boolean;
}

interface SimplifiedProduct {
  productId: string;
  title: string;
  variants: SimplifiedVariant[];
}

export async function GET() {
  const shopId = "25437630";
  const apiToken = process.env.PRINTIFY_API_TOKEN;

  if (!apiToken) {
    return NextResponse.json(
      { error: "Printify API token is not configured on the server." },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://api.printify.com/v1/shops/${shopId}/products.json`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        // Avoid Next.js caching stale product/pricing data
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          error: "Failed to fetch products from Printify.",
          status: response.status,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data: PrintifyProductsResponse = await response.json();

    const simplified: SimplifiedProduct[] = data.data.map((product) => ({
      productId: product.id,
      title: product.title,
      variants: product.variants.map((variant) => ({
        variantId: variant.id,
        variantTitle: variant.title,
        sku: variant.sku,
        price: variant.price,
        enabled: variant.is_enabled,
      })),
    }));

    return NextResponse.json({ products: simplified });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unexpected error while fetching Printify products.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}