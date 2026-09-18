import Image from "next/image";
import Link from "next/link";

const products = [
  {
    name: "Melted Mindz T-Shirt",
    description:
      "Official Melted Mindz Records apparel featuring the label logo.",
    price: "$30.00",
    image: "/products/melted-mindz-tee.jpg",
    href: "/products/melted-mindz-t-shirt",
  },
];

export default function ApparelPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
            Melted Mindz Records
          </p>

          <h1 className="mt-4 text-5xl font-black uppercase tracking-tight sm:text-6xl md:text-7xl">
            Apparel
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-zinc-400 md:text-base">
            Official Melted Mindz Records apparel. Represent the label
            with clothing made for fans, artists, and the culture around
            Melted Mindz.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-20">
        <div className="grid gap-8 sm:grid-cols-2">
          {products.map((product) => (
            <Link
              key={product.href}
              href={product.href}
              className="group block"
            >
              <div className="relative aspect-square overflow-hidden bg-zinc-900">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="mt-5">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-xl font-black uppercase tracking-tight">
                    {product.name}
                  </h2>

                  <p className="shrink-0 text-sm font-semibold">
                    {product.price}
                  </p>
                </div>

                <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">
                  {product.description}
                </p>

                <span className="mt-5 inline-block text-xs font-bold uppercase tracking-[0.2em] underline underline-offset-4">
                  View Product
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}