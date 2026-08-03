import { NextResponse } from "next/server";

export async function GET() {
  try {
    const token = process.env.PRINTIFY_API_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: "PRINTIFY_API_TOKEN is missing from .env.local" },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://api.printify.com/v1/shops.json",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Printify API error:", data);

      return NextResponse.json(
        {
          error: "Printify API request failed.",
          details: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Printify shop lookup error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve Printify shops." },
      { status: 500 }
    );
  }
}