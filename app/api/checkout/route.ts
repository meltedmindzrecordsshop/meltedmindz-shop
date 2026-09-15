import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  getSyncProductDetailFresh,
  findVariantBySize,
} from "@/lib/printful";

function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  return new Stripe(secretKey);
}

const VALID_SIZES = [
  "S",
  "M",
  "L",
  "XL",
  "2XL",
  "3XL",
  "4XL",
  "5XL",
] as const;

type ValidSize = (typeof VALID_SIZES)[number];

type CartItem = {
  id: string;
  printfulProductId?: string;
  quantity: number;
  size?: string;
};

type ValidatedCartItem = {
  id: string;
  printfulProductId: string;
  quantity: number;
  size: ValidSize;
};

export async function POST(request: Request) {
  try {
    const stripe = getStripe();

    const body = await request.json();

    let cartItems: CartItem[] = [];

    /*
     * CART CHECKOUT
     */
    if (Array.isArray(body.items)) {
      cartItems = body.items;
    }

    /*
     * BUY NOW
     */
    else if (body.product) {
      cartItems = [
        {
          id: String(body.product),
          printfulProductId: String(body.product),
          quantity: Number(body.quantity ?? 1),
          size:
            typeof body.size === "string"
              ? body.size
              : undefined,
        },
      ];
    }

    /*
     * CART MUST NOT BE EMPTY
     */
    if (cartItems.length === 0) {
      return NextResponse.json(
        {
          error: "Your cart is empty.",
        },
        { status: 400 }
      );
    }

    /*
     * VALIDATE CART ITEMS
     */
    const validatedItems: ValidatedCartItem[] = [];

    for (const item of cartItems) {
      if (!item.id) {
        return NextResponse.json(
          {
            error: "Invalid product.",
          },
          { status: 400 }
        );
      }

      if (!item.printfulProductId) {
        return NextResponse.json(
          {
            error:
              `Missing Printful product ID for ${item.id}. ` +
              `Please remove this item from your cart and add it again.`,
          },
          { status: 400 }
        );
      }

      if (!item.size) {
        return NextResponse.json(
          {
            error: `Please select a size for ${item.id}.`,
          },
          { status: 400 }
        );
      }

      if (
        !VALID_SIZES.includes(
          item.size as ValidSize
        )
      ) {
        return NextResponse.json(
          {
            error: `Invalid size for ${item.id}.`,
          },
          { status: 400 }
        );
      }

      const quantity = Number(item.quantity);

      if (
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 20
      ) {
        return NextResponse.json(
          {
            error: `Invalid quantity for ${item.id}.`,
          },
          { status: 400 }
        );
      }

      validatedItems.push({
        id: item.id,
        printfulProductId: item.printfulProductId,
        quantity,
        size: item.size as ValidSize,
      });
    }

    /*
     * RESOLVE PRODUCTS FROM PRINTFUL
     */
    const resolvedItems: Array<{
      productKey: string;
      printfulProductId: string;
      productName: string;
      size: string;
      quantity: number;
      unitAmountCents: number;
      syncVariantId: number;
    }> = [];

    for (const item of validatedItems) {
      let syncProductDetail;

      try {
        syncProductDetail =
          await getSyncProductDetailFresh(
            item.printfulProductId
          );
      } catch (error) {
        console.error(
          `Printful lookup failed for ${item.printfulProductId}:`,
          error
        );

        return NextResponse.json(
          {
            error:
              `Product not found in Printful: ${item.printfulProductId}`,
          },
          { status: 400 }
        );
      }

      if (!syncProductDetail?.syncProduct) {
        return NextResponse.json(
          {
            error:
              `Product not found in Printful: ${item.printfulProductId}`,
          },
          { status: 400 }
        );
      }

      /*
       * FIND SELECTED SIZE
       */
      const variant = findVariantBySize(
        syncProductDetail.variants,
        item.size
      );

      if (!variant) {
        return NextResponse.json(
          {
            error:
              `Size ${item.size} is not available for ` +
              `${syncProductDetail.syncProduct.name}.`,
          },
          { status: 400 }
        );
      }

      /*
       * GET PRICE FROM PRINTFUL
       */
      const unitAmountCents = Math.round(
        parseFloat(variant.retail_price) * 100
      );

      if (
        !Number.isFinite(unitAmountCents) ||
        unitAmountCents <= 0
      ) {
        return NextResponse.json(
          {
            error:
              `Invalid price for ` +
              `${syncProductDetail.syncProduct.name}.`,
          },
          { status: 500 }
        );
      }

      resolvedItems.push({
        productKey: item.id,
        printfulProductId: item.printfulProductId,
        productName:
          syncProductDetail.syncProduct.name,
        size: item.size,
        quantity: item.quantity,
        unitAmountCents,
        syncVariantId: variant.id,
      });
    }

    /*
     * STRIPE LINE ITEMS
     */
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      resolvedItems.map((item) => ({
        price_data: {
          currency: "usd",
          unit_amount: item.unitAmountCents,
          product_data: {
            name: `${item.productName} (${item.size})`,
          },
        },
        quantity: item.quantity,
      }));

    /*
     * STRIPE METADATA
     */
    const metadata: Record<string, string> = {};

    resolvedItems.forEach((item, index) => {
      const number = index + 1;

      metadata[`item_${number}_product`] =
        item.productName;

      metadata[`item_${number}_id`] =
        item.productKey;

      metadata[`item_${number}_printful_product_id`] =
        item.printfulProductId;

      metadata[`item_${number}_quantity`] =
        String(item.quantity);

      metadata[`item_${number}_size`] =
        item.size;

      metadata[`item_${number}_variant_id`] =
        String(item.syncVariantId);
    });

    /*
     * SITE URL
     */
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL;

    if (!siteUrl) {
      return NextResponse.json(
        {
          error: "Site URL is missing.",
        },
        { status: 500 }
      );
    }

    /*
     * CREATE STRIPE CHECKOUT
     */
    const session =
      await stripe.checkout.sessions.create({
        mode: "payment",

        line_items: lineItems,

        metadata,

        shipping_address_collection: {
          allowed_countries: ["US"],
        },

        billing_address_collection: "auto",

        phone_number_collection: {
          enabled: true,
        },

        success_url:
          `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${siteUrl}/cart`,
      });

    console.log(
      "Stripe checkout session created:",
      session.id
    );

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error(
      "Stripe checkout error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to create checkout session.",
      },
      { status: 500 }
    );
  }
}