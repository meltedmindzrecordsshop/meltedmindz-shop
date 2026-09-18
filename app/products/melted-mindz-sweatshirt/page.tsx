"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";

const PRODUCT = {
id: "6a7076a5603264",
name: "Melted Mindz Sweatshirt",
price: 45,
image:
"https://files.cdn.printful.com/files/c5b/c5b3164d3b30232898037f4a1c4649d3_preview.png",
};

const SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];

export default function MeltedMindzSweatshirtPage() {
const router = useRouter();
const { addToCart } = useCart();

const [size, setSize] = useState("");
const [quantity, setQuantity] = useState(1);
const [adding, setAdding] = useState(false);

function handleAddToCart() {
if (!size) {
alert("Please select a size.");
return;
}

setAdding(true);

addToCart({
  id: PRODUCT.id,
  printfulProductId: PRODUCT.id,
  name: PRODUCT.name,
  price: PRODUCT.price,
  image: PRODUCT.image,
  size,
  quantity,
});

router.push("/cart");

}

return (
<main className="min-h-screen bg-white text-black">
<div className="mx-auto max-w-7xl px-6 py-12">
<div className="grid gap-12 md:grid-cols-2">
<div className="flex items-center justify-center bg-gray-100 p-8">
<img src={PRODUCT.image} alt={PRODUCT.name} className="w-full max-w-xl object-contain" />
</div>

      <div className="flex flex-col justify-center">
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-gray-500">
          Melted Mindz
        </p>

        <h1 className="text-4xl font-bold tracking-tight">
          {PRODUCT.name}
        </h1>

        <p className="mt-5 text-2xl font-semibold">
          ${PRODUCT.price.toFixed(2)}
        </p>

        <p className="mt-6 max-w-xl text-gray-600">
          Official Melted Mindz sweatshirt. Shipping is calculated
          separately at checkout.
        </p>

        <div className="mt-8">
          <label className="mb-3 block text-sm font-semibold uppercase tracking-wide">
            Size
          </label>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {SIZES.map((itemSize) => (
              <button
                key={itemSize}
                type="button"
                onClick={() => setSize(itemSize)}
                className={`border px-4 py-3 text-sm font-medium transition ${
                  size === itemSize
                    ? "border-black bg-black text-white"
                    : "border-gray-300 bg-white text-black hover:border-black"
                }`}
              >
                {itemSize}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <label className="mb-3 block text-sm font-semibold uppercase tracking-wide">
            Quantity
          </label>

          <div className="flex w-fit items-center border border-gray-300">
            <button
              type="button"
              onClick={() =>
                setQuantity((current) => Math.max(1, current - 1))
              }
              className="px-4 py-3 text-lg"
            >
              −
            </button>

            <span className="min-w-12 text-center">{quantity}</span>

            <button
              type="button"
              onClick={() =>
                setQuantity((current) => Math.min(20, current + 1))
              }
              className="px-4 py-3 text-lg"
            >
              +
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={adding}
          className="mt-10 w-full bg-black px-6 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {adding ? "Adding..." : "Add to Cart"}
        </button>

        <p className="mt-4 text-sm text-gray-500">
          Shipping and applicable taxes are calculated at checkout.
        </p>
      </div>
    </div>
  </div>
</main>

);
}