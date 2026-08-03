"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "../../context/CartContext";

export default function MeltedMindzHoodiePage() {
const { addToCart } = useCart();

const [selectedSize, setSelectedSize] = useState("");
const [quantity, setQuantity] = useState(1);
const [added, setAdded] = useState(false);

const sizes = ["S", "M", "L", "XL"];

function handleAddToCart() {
if (!selectedSize) {
alert("Please select a hoodie size before adding it to your cart.");
return;
}

addToCart({
  id: "melted-mindz-hoodie",
  name: "Melted Mindz Hoodie",
  price: 60,
  image: "/products/melted-mindz-hoodie.jpg",
  size: selectedSize,
  quantity,
  stripePriceId: "price_1U0FSJLl0yEj4MURNt38CsbA",
});

setAdded(true);

setTimeout(() => {
  setAdded(false);
}, 2500);

}

return (
<main className="min-h-screen bg-black text-white">
<section className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-20">

    <Link
      href="/#shop"
      className="inline-flex rounded-sm text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400 underline-offset-4 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      ← Back to Shop
    </Link>

    <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-20">

      {/* PRODUCT IMAGE */}

      <div className="relative aspect-square overflow-hidden bg-zinc-900">
        <Image
          src="/products/melted-mindz-hoodie.jpg"
          alt="Melted Mindz Records Hoodie"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {/* PRODUCT INFORMATION */}

      <div className="flex flex-col justify-center">

        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
          Melted Mindz Records
        </p>

        <h1 className="mt-4 text-4xl font-black uppercase leading-none tracking-tight sm:text-5xl md:text-6xl">
          Melted Mindz
          <br />
          Hoodie
        </h1>

        <p className="mt-6 text-xl font-medium">
          $60.00
        </p>

        {/* DESCRIPTION */}

        <div className="mt-8 border-t border-white/10 pt-8">
          <p className="max-w-lg text-sm leading-7 text-zinc-300">
            Official Melted Mindz Records hoodie. A heavyweight
            statement piece made for fans of the label and its artists.
          </p>
        </div>

        {/* SIZE */}

        <div className="mt-8">

          <p
            id="hoodie-size-label"
            className="text-xs font-semibold uppercase tracking-[0.25em]"
          >
            Size
          </p>

          <div
            className="mt-4 grid grid-cols-4 gap-2"
            role="group"
            aria-labelledby="hoodie-size-label"
          >

            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                aria-pressed={selectedSize === size}
                className={`min-h-[52px] border-2 py-4 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                  selectedSize === size
                    ? "border-white bg-white text-black"
                    : "border-white/30 bg-black text-white hover:border-white"
                }`}
              >
                {size}
              </button>
            ))}

          </div>

          {selectedSize && (
            <p className="mt-3 text-xs text-zinc-400">
              Selected size:{" "}
              <span className="font-semibold text-white">
                {selectedSize}
              </span>
            </p>
          )}

        </div>

        {/* QUANTITY */}

        <div className="mt-8">

          <p
            id="hoodie-quantity-label"
            className="text-xs font-semibold uppercase tracking-[0.25em]"
          >
            Quantity
          </p>

          <div
            className="mt-4 flex w-fit items-center border-2 border-white/20"
            aria-labelledby="hoodie-quantity-label"
          >

            <button
              type="button"
              onClick={() =>
                setQuantity((current) =>
                  Math.max(1, current - 1)
                )
              }
              aria-label="Decrease hoodie quantity"
              className="flex h-12 w-12 items-center justify-center text-lg font-bold text-white hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              −
            </button>

            <span
              aria-live="polite"
              className="min-w-12 text-center text-sm font-bold"
            >
              {quantity}
            </span>

            <button
              type="button"
              onClick={() =>
                setQuantity((current) =>
                  Math.min(20, current + 1)
                )
              }
              aria-label="Increase hoodie quantity"
              className="flex h-12 w-12 items-center justify-center text-lg font-bold text-white hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              +
            </button>

          </div>

        </div>

        {/* ADD TO CART */}

        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-8 min-h-[56px] w-full border-2 border-white bg-white px-6 py-5 text-sm font-black uppercase tracking-[0.15em] text-black transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          {added
            ? "Added to Cart ✓"
            : `Add to Cart — $${(60 * quantity).toFixed(2)}`}
        </button>

        {/* VIEW CART */}

        {added && (
          <Link
            href="/cart"
            className="mt-3 flex min-h-[52px] items-center justify-center border-2 border-white bg-black px-6 py-4 text-xs font-black uppercase tracking-[0.15em] text-white hover:opacity-70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white"
          >
            View Cart
          </Link>
        )}

        {/* DETAILS */}

        <div className="mt-10 border-t border-white/10">

          <details className="border-b border-white/10 py-5">
            <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.2em]">
              Product Details
            </summary>

            <p className="mt-5 text-sm leading-7 text-zinc-400">
              Official Melted Mindz Records apparel.
              Product specifications and materials will be added
              once the final merchandise specifications are confirmed.
            </p>
          </details>

          <details className="border-b border-white/10 py-5">
            <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.2em]">
              Shipping
            </summary>

            <p className="mt-5 text-sm leading-7 text-zinc-400">
              Shipping information will be provided during checkout.
            </p>
          </details>

          <details className="border-b border-white/10 py-5">
            <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.2em]">
              Returns
            </summary>

            <p className="mt-5 text-sm leading-7 text-zinc-400">
              Return information will be provided before completing your
              purchase.
            </p>
          </details>

        </div>

      </div>
    </div>
  </section>
</main>

);
}