import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRODUCTS = {
"melted-mindz-t-shirt": {
name: "Melted Mindz Records T-Shirt",
priceId: "price_1U0EGZLl0yEj4MURYj7ICxg3",
},
"melted-mindz-hoodie": {
name: "Melted Mindz Hoodie",
priceId: "price_1U0FSJLl0yEj4MURNt38CsbA",
},
} as const;

type ProductId = keyof typeof PRODUCTS;

export async function POST(request: Request) {
try {
const body = await request.json();

if (!Array.isArray(body.items) || body.items.length === 0) {
  return NextResponse.json(
    { error: "Your cart is empty." },
    { status: 400 }
  );
}

const cartItems = body.items;

for (const item of cartItems) {
  if (!item.id || !PRODUCTS[item.id as ProductId]) {
    return NextResponse.json(
      {
        error: `Invalid product: ${item.id ?? "unknown"}`,
      },
      { status: 400 }
    );
  }

  if (
    item.size &&
    !["S", "M", "L", "XL"].includes(item.size)
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
}

const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
  cartItems.map((item: {
    id: string;
    quantity: number;
    size?: string;
  }) => {
    const product = PRODUCTS[item.id as ProductId];

    return {
      price: product.priceId,
      quantity: Number(item.quantity),
    };
  });

const metadata: Record<string, string> = {};

cartItems.forEach(
  (
    item: {
      id: string;
      quantity: number;
      size?: string;
    },
    index: number
  ) => {
    const product = PRODUCTS[item.id as ProductId];

    metadata[`item_${index + 1}_product`] = product.name;
    metadata[`item_${index + 1}_id`] = item.id;
    metadata[`item_${index + 1}_quantity`] =
      String(item.quantity);

    if (item.size) {
      metadata[`item_${index + 1}_size`] = item.size;
    }
  }
);

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

if (!siteUrl) {
  return NextResponse.json(
    { error: "Site URL is missing." },
    { status: 500 }
  );
}

const session = await stripe.checkout.sessions.create({
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

return NextResponse.json({
  url: session.url,
});

} catch (error) {
console.error("Stripe checkout error:", error);

return NextResponse.json(
  {
    error: "Unable to create checkout session.",
  },
  {
    status: 500,
  }
);

}
}