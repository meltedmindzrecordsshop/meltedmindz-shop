import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createHash } from "crypto";
import {
  getExistingOrderByExternalId,
  getSyncProductDetail,
  findVariantBySize,
  createPrintfulOrder,
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

function getPrintfulExternalId(stripeSessionId: string): string {
  const hash = createHash("sha256")
    .update(stripeSessionId)
    .digest("hex")
    .slice(0, 24);

  return "mm_" + hash;
}

export async function POST(request: Request) {
  const stripe = getStripe();

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature." },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is missing.");

    return NextResponse.json(
      { error: "Stripe webhook secret is missing." },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    const body = await request.text();

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error(
      "Stripe webhook signature verification failed:",
      error
    );

    return NextResponse.json(
      { error: "Invalid Stripe webhook signature." },
      { status: 400 }
    );
  }

  try {
    if (event.type !== "checkout.session.completed") {
      return NextResponse.json({ received: true });
    }

    const eventSession =
      event.data.object as Stripe.Checkout.Session;

    if (eventSession.payment_status !== "paid") {
      console.log(
        `Stripe session ${eventSession.id} has not been paid yet.`
      );

      return NextResponse.json({
        received: true,
      });
    }

    const session = await stripe.checkout.sessions.retrieve(
      eventSession.id
    );

    const printfulExternalId =
      getPrintfulExternalId(session.id);

    if (!process.env.PRINTFUL_API_TOKEN) {
      console.error("PRINTFUL_API_TOKEN is missing.");

      return NextResponse.json(
        { error: "Printful API token is missing." },
        { status: 500 }
      );
    }

    const existingOrder =
      await getExistingOrderByExternalId(
        printfulExternalId
      );

    if (existingOrder) {
      console.log(
        `Duplicate Printful order detected for Stripe session ${session.id}.`
      );

      return NextResponse.json({
        received: true,
        duplicate: true,
        stripeSessionId: session.id,
        printfulExternalId,
        printfulOrderId: existingOrder.id,
      });
    }

    console.log(
      `Processing paid Stripe Checkout Session ${session.id}`
    );

    console.log(
      `Printful external ID: ${printfulExternalId}`
    );

    const metadata = session.metadata || {};

    const itemIndexes = Object.keys(metadata)
      .filter(
        (key) =>
          key.startsWith("item_") &&
          key.endsWith("_id")
      )
      .map((key) => Number(key.split("_")[1]))
      .filter((index) => Number.isInteger(index))
      .sort((a, b) => a - b);

    if (itemIndexes.length === 0) {
      console.error(
        `No product metadata found for Stripe session ${session.id}.`
      );

      return NextResponse.json(
        {
          error: "No product information found.",
        },
        { status: 400 }
      );
    }

    const printfulItems: Array<{
      sync_variant_id: number;
      quantity: number;
    }> = [];

    for (const index of itemIndexes) {
      const productKey =
        metadata[`item_${index}_id`];

      const printfulProductId =
        metadata[
          `item_${index}_printful_product_id`
        ];

      const size =
        metadata[`item_${index}_size`];

      const quantity = Number(
        metadata[`item_${index}_quantity`]
      );

      if (!productKey) {
        return NextResponse.json(
          {
            error: "Invalid product reference.",
          },
          { status: 400 }
        );
      }

      if (!printfulProductId) {
        return NextResponse.json(
          {
            error:
              `Missing Printful product ID for ${productKey}.`,
          },
          { status: 400 }
        );
      }

      if (
        !size ||
        !VALID_SIZES.includes(
          size as (typeof VALID_SIZES)[number]
        )
      ) {
        return NextResponse.json(
          {
            error: "Invalid product size.",
          },
          { status: 400 }
        );
      }

      if (
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 20
      ) {
        return NextResponse.json(
          {
            error: "Invalid product quantity.",
          },
          { status: 400 }
        );
      }

      let syncProductDetail;

      try {
        syncProductDetail =
          await getSyncProductDetail(
            printfulProductId
          );
      } catch (error) {
        console.error(
          `Printful product lookup failed for ${printfulProductId}:`,
          error
        );

        return NextResponse.json(
          {
            error:
              `Invalid Printful product: ${printfulProductId}`,
            details:
              error instanceof Error
                ? error.message
                : String(error),
          },
          { status: 400 }
        );
      }

      const variant =
        findVariantBySize(
          syncProductDetail.variants,
          size
        );

      if (!variant) {
        console.error(
          `No Printful variant found for ${printfulProductId} / ${size}`
        );

        return NextResponse.json(
          {
            error:
              "Printful variant not found.",
          },
          { status: 400 }
        );
      }

      printfulItems.push({
        sync_variant_id: variant.id,
        quantity,
      });

      console.log(
        `Prepared Printful item: ${syncProductDetail.syncProduct.name} / ${size} / quantity ${quantity}`
      );
    }

    const shippingDetails =
      session.collected_information
        ?.shipping_details;

    if (!shippingDetails?.address) {
      return NextResponse.json(
        {
          error:
            "Shipping address is missing from Stripe Checkout Session.",
        },
        { status: 400 }
      );
    }

    const address =
      shippingDetails.address;

    const customerEmail =
      session.customer_details?.email;

    if (!customerEmail) {
      return NextResponse.json(
        {
          error:
            "Customer email is missing from Stripe Checkout Session.",
        },
        { status: 400 }
      );
    }

    console.log(
      `Creating Printful order for Stripe session ${session.id}`
    );

    let printfulOrder;

    try {
      printfulOrder =
        await createPrintfulOrder({
          externalId: printfulExternalId,

          items: printfulItems,

          recipient: {
            name:
              shippingDetails.name ||
              "Customer",

            email: customerEmail,

            phone:
              session.customer_details
                ?.phone || undefined,

            address1:
              address.line1 || "",

            address2:
              address.line2 || undefined,

            city:
              address.city || "",

            state_code:
              address.state || undefined,

            country_code:
              address.country || "US",

            zip:
              address.postal_code || "",
          },
        });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : String(error);

      if (
        errorMessage.includes(
          "Order with this External ID already exists"
        ) ||
        errorMessage.includes("OR-13")
      ) {
        console.log(
          `Duplicate Printful order detected for Stripe session ${session.id}.`
        );

        const duplicateOrder =
          await getExistingOrderByExternalId(
            printfulExternalId
          );

        return NextResponse.json({
          received: true,
          duplicate: true,
          stripeSessionId: session.id,
          printfulExternalId,
          printfulOrderId:
            duplicateOrder?.id ?? null,
        });
      }

      console.error(
        "Printful order creation failed:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Printful order creation failed.",
          details: errorMessage,
        },
        { status: 500 }
      );
    }

    console.log(
      "Printful order created successfully:",
      printfulOrder.id
    );

    return NextResponse.json({
      received: true,
      duplicate: false,
      stripeSessionId: session.id,
      printfulExternalId,
      printfulOrderId: printfulOrder.id,
    });
  } catch (error) {
    console.error(
      "Stripe webhook error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Webhook processing failed.",
      },
      { status: 500 }
    );
  }
}