import { NextResponse } from "next/server";
import { getSyncProductDetail } from "@/lib/printful";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Pass ?id=<printful_product_id>" },
      { status: 400 }
    );
  }

  const detail = await getSyncProductDetail(id);
  return NextResponse.json(detail);
}