"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function CartPage() {
const {
items,
cartCount,
cartTotal,
removeFromCart,
updateQuantity,
clearCart,
} = useCart();

const [checkoutLoading, setCheckoutLoading] = useState(false);

async function handleCheckout() {
if (items.length === 0) {
return;
}

setCheckoutLoading(true);

try {
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: items.map((item) => ({
        id: item.id,
        printfulProductId: item.printfulProductId,
        quantity: item.quantity,
        size: item.size,
      })),
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Unable to start checkout."
    );
  }

  if (!data.url) {
    throw new Error(
      "Stripe checkout URL was not returned."
    );
  }

  window.location.href = data.url;
} catch (error) {
  console.error("Checkout error:", error);

  alert(
    error instanceof Error
      ? error.message
      : "Something went wrong. Please try again."
  );

  setCheckoutLoading(false);
}

}

return (
<main className="min-h-screen bg-black text-white">
{/* HERO */}

  <section className="border-b border-white/10">
    <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-32">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-400">
        Melted Mindz Records
      </p>

      <h1 className="mt-6 text-6xl font-black uppercase leading-[0.9] tracking-tight sm:text-7xl md:text-9xl">
        Cart
      </h1>

      <p className="mt-8 max-w-2xl text-base leading-7 text-zinc-300 md:text-lg">
        {cartCount > 0
          ? `${cartCount} item${
              cartCount === 1 ? "" : "s"
            } in your cart.`
          : "Your cart is empty."}
      </p>
    </div>
  </section>

  {/* CART CONTENT */}

  <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
    {items.length === 0 ? (
      /* EMPTY CART */

      <div className="border border-white/10 bg-zinc-950 p-12 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-400">
          Nothing here yet
        </p>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-zinc-500">
          Add some official Melted Mindz Records merchandise to your
          cart and it will appear here.
        </p>

        <Link
          href="/collections"
          className="mt-8 inline-flex min-h-[52px] items-center justify-center border-2 border-white bg-black px-7 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          ← Continue Shopping
        </Link>
      </div>
    ) : (
      <div className="grid gap-10 lg:grid-cols-3">
        {/* CART ITEMS */}

        <div className="flex flex-col gap-5 lg:col-span-2">
          {items.map((item) => (
            <article
              key={`${item.id}-${item.size ?? "default"}`}
              className="flex flex-col gap-6 border border-white/10 bg-zinc-950 p-6 sm:flex-row sm:items-center"
            >
              {/* PRODUCT IMAGE */}

              <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden border border-white/10 bg-zinc-900">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </div>

              {/* PRODUCT INFO */}

              <div className="flex flex-1 flex-col">
                <h2 className="text-lg font-black uppercase tracking-tight">
                  {item.name}
                </h2>

                {item.size && (
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-zinc-400">
                    Size: {item.size}
                  </p>
                )}

                <p className="mt-2 text-sm text-zinc-300">
                  ${item.price.toFixed(2)} each
                </p>

                {/* REMOVE */}

                <button
                  type="button"
                  onClick={() =>
                    removeFromCart(item.id, item.size)
                  }
                  className="mt-4 w-fit border-b border-white/40 pb-1 text-xs font-bold uppercase tracking-[0.2em] text-white hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Remove
                </button>
              </div>

              {/* QUANTITY */}

              <div className="flex items-center gap-3 self-start border-2 border-white/20 px-3 py-2 sm:self-center">
                <button
                  type="button"
                  onClick={() =>
                    updateQuantity(
                      item.id,
                      item.quantity - 1,
                      item.size
                    )
                  }
                  aria-label={`Decrease quantity of ${item.name}`}
                  className="flex h-9 w-9 items-center justify-center text-lg font-bold text-white hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  −
                </button>

                <span
                  aria-label={`Quantity ${item.quantity}`}
                  className="w-6 text-center text-sm font-bold"
                >
                  {item.quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    updateQuantity(
                      item.id,
                      item.quantity + 1,
                      item.size
                    )
                  }
                  aria-label={`Increase quantity of ${item.name}`}
                  className="flex h-9 w-9 items-center justify-center text-lg font-bold text-white hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  +
                </button>
              </div>

              {/* ITEM TOTAL */}

              <div className="w-full text-left sm:w-24 sm:text-right">
                <p className="text-sm font-bold">
                  $
                  {(
                    item.price * item.quantity
                  ).toFixed(2)}
                </p>
              </div>
            </article>
          ))}

          {/* CLEAR CART */}

          <button
            type="button"
            onClick={clearCart}
            className="mt-2 w-fit border-2 border-white bg-black px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white hover:opacity-70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Clear Cart
          </button>
        </div>

        {/* ORDER SUMMARY */}

        <aside className="h-fit border border-white/10 bg-zinc-950 p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
            Order Summary
          </p>

          <div className="mt-6 flex items-center justify-between text-sm text-zinc-300">
            <span>Subtotal</span>

            <span>
              ${cartTotal.toFixed(2)}
            </span>
          </div>

          <div className="mt-3 flex items-start justify-between gap-6 text-sm text-zinc-400">
            <span>Shipping</span>

            <span className="text-right">
              Calculated at checkout
            </span>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-6 text-base font-bold">
            <span>Total</span>

            <span>
              ${cartTotal.toFixed(2)}
            </span>
          </div>

          {/* CHECKOUT */}

          <button
            type="button"
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="mt-8 min-h-[56px] w-full border-2 border-white bg-white px-6 py-4 text-xs font-black uppercase tracking-[0.25em] text-black transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {checkoutLoading
              ? "Loading Checkout..."
              : "Checkout"}
          </button>

          {/* CONTINUE SHOPPING */}

          <Link
            href="/collections"
            className="mt-4 flex min-h-[52px] items-center justify-center border-2 border-white bg-black px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white hover:opacity-70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Continue Shopping
          </Link>
        </aside>
      </div>
    )}
  </section>
</main>

);
}