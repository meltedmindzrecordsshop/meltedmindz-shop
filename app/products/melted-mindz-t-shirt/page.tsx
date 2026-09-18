"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "../../context/CartContext";

const PRINTFUL_TSHIRT_ID = "6a7075b9942ef8";

export default function MeltedMindzTShirtPage() {
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const { addToCart } = useCart();

  function handleAddToCart() {
    if (!selectedSize) {
      alert("Please select a size before adding to your cart.");
      return;
    }

    addToCart({
      id: "melted-mindz-t-shirt",
      name: "Melted Mindz Records T-Shirt",
      price: 30,
      image: "/products/melted-mindz-tee.jpg",
      size: selectedSize,
      quantity: 1,
      printfulProductId: PRINTFUL_TSHIRT_ID,
    });

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2500);
  }

  async function handleCheckout() {
    if (!selectedSize) {
      alert("Please select a size before continuing.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: PRINTFUL_TSHIRT_ID,
          size: selectedSize,
          quantity: 1,
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

      setLoading(false);
    }
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
              src="/products/melted-mindz-tee.jpg"
              alt="Melted Mindz Records T-Shirt"
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
              T-Shirt
            </h1>

            <p className="mt-6 text-xl font-medium">
              $30.00
            </p>

            {/* DESCRIPTION */}

            <div className="mt-8 border-t border-white/10 pt-8">
              <p className="max-w-lg text-sm leading-7 text-zinc-300">
                Official Melted Mindz Records merchandise. A classic
                Melted Mindz piece made for fans of the label and its artists.
              </p>
            </div>

            {/* SIZE */}

            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.25em]">
                Size
              </p>

              <div
                className="mt-4 grid grid-cols-4 gap-2"
                role="group"
                aria-label="Select shirt size"
              >
                {["S", "M", "L", "XL"].map((size) => (
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

            {/* ADD TO CART */}

            <button
              type="button"
              onClick={handleAddToCart}
              className="mt-8 min-h-[56px] w-full border-2 border-white bg-black px-6 py-5 text-sm font-black uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              {added ? "Added to Cart ✓" : "Add to Cart"}
            </button>

            {/* BUY NOW */}

            <button
              type="button"
              onClick={handleCheckout}
              disabled={loading}
              className="mt-3 min-h-[56px] w-full border-2 border-white bg-white px-6 py-5 text-sm font-black uppercase tracking-[0.15em] text-black transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Loading Checkout..."
                : "Buy Now — $30.00"}
            </button>

            {/* VIEW CART */}

            {added && (
              <Link
                href="/cart"
                className="mt-3 flex min-h-[52px] items-center justify-center border-2 border-white bg-black px-6 py-4 text-xs font-black uppercase tracking-[0.15em] text-white hover:opacity-70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                View Cart
              </Link>
            )}

            {/* PRODUCT INFORMATION */}

            <div className="mt-10 border-t border-white/10">
              <details className="border-b border-white/10 py-5">
                <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.2em]">
                  Product Details
                </summary>

                <p className="mt-5 text-sm leading-7 text-zinc-400">
                  Official Melted Mindz Records apparel.
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
                  Return information will be provided before completing
                  your purchase.
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}