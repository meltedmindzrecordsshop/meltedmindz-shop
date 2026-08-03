import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRINTIFY_SHOP_ID = "25437630";

const PRINTIFY_PRODUCTS = {
  "melted-mindz-t-shirt": {
    productId: "6a6ed1548ef69e3f3f081405",
    variants: {
      S: 73196,
      M: 73200,
      L: 73204,
      XL: 73208,
    },
  },
  "melted-mindz-hoodie": {
    productId: "6a6ed28205d7787ed60f822f",
    variants: {
      S: 32918,
      M: 32919,
      L: 32920,
      XL: 32921,
    },
  },
} as const;

type ProductId = keyof typeof PRINTIFY_PRODUCTS;
type Size = "S" | "M" | "L" | "XL";

export async function POST(request: Request) {
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

      return NextResponse.json({ received: true });
    }

    const session = await stripe.checkout.sessions.retrieve(
      eventSession.id
    );

    console.log(
      `Processing paid Stripe Checkout Session ${session.id}`
    );

    const printifyToken = process.env.PRINTIFY_API_TOKEN;

    if (!printifyToken) {
      console.error("PRINTIFY_API_TOKEN is missing.");

      return NextResponse.json(
        { error: "Printify API token is missing." },
        { status: 500 }
      );
    }

    /*
     * Check whether this Stripe session already created
     * a Printify order.
     */
    const existingOrderResponse = await fetch(
      `https://api.printify.com/v1/shops/${PRINTIFY_SHOP_ID}/orders.json?external_id=${encodeURIComponent(
        session.id
      )}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${printifyToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (existingOrderResponse.ok) {
      const existingOrderData =
        await existingOrderResponse.json();

      const existingOrders = existingOrderData?.data || [];

      if (existingOrders.length > 0) {
        console.log(
          `Printify order already exists for Stripe session ${session.id}.`
        );

        return NextResponse.json({
          received: true,
          duplicate: true,
          stripeSessionId: session.id,
          printifyOrderId: existingOrders[0].id,
        });
      }
    }

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
        { error: "No product information found." },
        { status: 400 }
      );
    }

    const lineItems: Array<{
      productId: string;
      variantId: number;
      quantity: number;
    }> = [];

    for (const index of itemIndexes) {
      const productId =
        metadata[`item_${index}_id`] as ProductId;

      const size =
        metadata[`item_${index}_size`] as Size | undefined;

      const quantity = Number(
        metadata[`item_${index}_quantity`]
      );

      if (!PRINTIFY_PRODUCTS[productId]) {
        console.error(
          `Invalid Printify product: ${productId}`
        );

        return NextResponse.json(
          { error: "Invalid Printify product." },
          { status: 400 }
        );
      }

      if (
        !size ||
        !["S", "M", "L", "XL"].includes(size)
      ) {
        console.error(
          `Invalid size for ${productId}: ${size}`
        );

        return NextResponse.json(
          { error: "Invalid product size." },
          { status: 400 }
        );
      }

      if (
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 20
      ) {
        console.error(
          `Invalid quantity for ${productId}: ${quantity}`
        );

        return NextResponse.json(
          { error: "Invalid product quantity." },
          { status: 400 }
        );
      }

      const product = PRINTIFY_PRODUCTS[productId];

      const variantId = product.variants[size];

      if (!variantId) {
        console.error(
          `No Printify variant found for ${productId} / ${size}`
        );

        return NextResponse.json(
          { error: "Printify variant not found." },
          { status: 400 }
        );
      }

      lineItems.push({
        productId: product.productId,
        variantId,
        quantity,
      });
    }

    const shippingDetails = session.collected_information?.shipping_details;

    if (!shippingDetails?.address) {
      console.error(
        `No shipping address found for Stripe session ${session.id}.`
      );

      console.error(
        "Stripe shipping details:",
        shippingDetails
      );

      return NextResponse.json(
        {
          error:
            "Shipping address is missing from Stripe Checkout Session.",
        },
        { status: 400 }
      );
    }

    const address = shippingDetails.address;

    const fullName = shippingDetails.name || "Customer";

    const nameParts = fullName.trim().split(/\s+/);

    const firstName = nameParts[0] || "Customer";

    const lastName =
      nameParts.length > 1
        ? nameParts.slice(1).join(" ")
        : "";

    const printifyItems = lineItems.map((item) => ({
      product_id: item.productId,
      variant_id: item.variantId,
      quantity: item.quantity,
    }));

    const printifyOrder = {
      external_id: session.id,

      label: `Melted Mindz Records Order ${session.id}`,

      line_items: printifyItems,

      shipping_method: 1,

      send_shipping_notification: true,

      address_to: {
        first_name: firstName,
        last_name: lastName,

        email:
          session.customer_details?.email || "",

        phone:
          session.customer_details?.phone || "",

        country: address.country || "US",
        region: address.state || "",
        address1: address.line1 || "",
        address2: address.line2 || "",
        city: address.city || "",
        zip: address.postal_code || "",
      },
    };

    console.log(
      `Creating Printify order for Stripe session ${session.id}`
    );

    const printifyResponse = await fetch(
      `https://api.printify.com/v1/shops/${PRINTIFY_SHOP_ID}/orders.json`,
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${printifyToken}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify(printifyOrder),
      }
    );

    const printifyData = await printifyResponse.json();

    if (!printifyResponse.ok) {
      console.error(
        "Printify order creation failed:",
        printifyData
      );

      return NextResponse.json(
        {
          error: "Printify order creation failed.",
          details: printifyData,
        },
        { status: 500 }
      );
    }

    console.log(
      "Printify order created successfully:",
      printifyData
    );

    return NextResponse.json({
      received: true,
      duplicate: false,
      stripeSessionId: session.id,
      printifyOrderId: printifyData.id,
    });
  } catch (error) {
    console.error(
      "Stripe webhook error:",
      error
    );

    return NextResponse.json(
      { error: "Webhook processing failed." },
      { status: 500 }
    );
  }
}