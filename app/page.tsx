import Image from "next/image";
import Link from "next/link";

type Product = {
name: string;
price: string;
image: string;
href: string;
category: string;
};

const products: Product[] = [
{
name: "Melted Mindz T-Shirt",
price: "$30.00",
image: "/products/melted-mindz-tee.jpg",
href: "/products/melted-mindz-t-shirt",
category: "Apparel",
},
{
name: "Melted Mindz Hoodie",
price: "$60.00",
image: "/products/melted-mindz-hoodie.jpg",
href: "/products/melted-mindz-hoodie",
category: "Apparel",
},
{
name: "Melted Mindz Sweatshirt",
price: "$45.00",
image: "/products/melted-mindz-sweatshirt.jpg",
href: "/products/melted-mindz-sweatshirt",
category: "Apparel",
},
];

export default function Home() {
return (
<main className="min-h-screen bg-black text-white">

  {/* HERO */}

  <section className="border-b border-white/10">
    <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">

      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">
        Melted Mindz Records
      </p>

      <h1 className="mt-6 max-w-5xl text-6xl font-black uppercase leading-[0.85] tracking-[-0.05em] sm:text-7xl md:text-9xl">
        Official
        <br />
        Merchandise
      </h1>

      <p className="mt-8 max-w-xl text-base leading-7 text-zinc-400 md:text-lg">
        Official merchandise from Melted Mindz Records and the artists
        who make up our roster.
      </p>

      <a
        href="#shop"
        aria-label="Shop Melted Mindz Records merchandise"
        className="mt-10 inline-flex min-h-[52px] items-center justify-center rounded-md border-2 border-white bg-black px-7 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white transition-none hover:border-white hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-black"
      >
        Shop Now
      </a>

    </div>
  </section>


  {/* SHOP */}

  <section
    id="shop"
    aria-labelledby="shop-heading"
    className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28"
  >

    <div className="flex items-end justify-between">

      <div>

        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
          Shop
        </p>

        <h2
          id="shop-heading"
          className="mt-3 text-4xl font-black uppercase tracking-tight md:text-6xl"
        >
          Latest
        </h2>

      </div>

      <p className="hidden text-sm text-zinc-400 sm:block">
        3 Products
      </p>

    </div>


    {/* PRODUCTS */}

    <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">

      {products.map((product) => (

        <Link
          key={product.href}
          href={product.href}
          aria-label={`View ${product.name}, ${product.price}`}
          className="group rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-black"
        >

          {/* PRODUCT IMAGE */}

          <div className="relative aspect-square overflow-hidden bg-zinc-900">

            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div
              className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/20"
              aria-hidden="true"
            />

          </div>


          {/* PRODUCT INFORMATION */}

          <div className="mt-5">

            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
              {product.category}
            </p>

            <div className="mt-2 flex items-center justify-between gap-4">

              <h3 className="text-lg font-bold uppercase tracking-tight">
                {product.name}
              </h3>

              <p className="text-sm text-zinc-300">
                {product.price}
              </p>

            </div>

            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
              View Product →
            </p>

          </div>

        </Link>

      ))}

    </div>

  </section>


  {/* BRAND SECTION */}

  <section className="border-y border-white/10">

    <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">

      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
        Melted Mindz Records
      </p>

      <h2 className="mt-6 max-w-4xl text-5xl font-black uppercase leading-[0.9] tracking-tight md:text-8xl">
        Built around
        <br />
        the music.
      </h2>

      <p className="mt-8 max-w-xl text-base leading-7 text-zinc-400">
        Official merchandise inspired by the artists, music, and creative
        world of Melted Mindz Records.
      </p>

    </div>

  </section>


  {/* FOOTER */}

  <footer className="border-t border-white/10 bg-black text-white">

    <div className="mx-auto max-w-7xl px-6 py-14 md:px-10">

      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">

        {/* BRAND */}

        <div>

          <p className="text-lg font-black uppercase tracking-tight">
            Melted Mindz Records
          </p>

          <p className="mt-3 max-w-xs text-sm leading-6 text-zinc-400">
            Official merchandise from Melted Mindz Records and the artists
            behind the music.
          </p>

        </div>


        {/* STORE */}

        <nav
          aria-label="Store navigation"
          className="flex flex-col"
        >

          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-white">
            Store
          </h2>

          <div className="flex flex-col gap-3">

            <Link
              href="/"
              className="w-fit text-sm text-zinc-400 underline-offset-4 transition-none hover:text-zinc-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Shop
            </Link>

            <Link
              href="/shipping"
              className="w-fit text-sm text-zinc-400 underline-offset-4 transition-none hover:text-zinc-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Shipping
            </Link>

            <Link
              href="/returns"
              className="w-fit text-sm text-zinc-400 underline-offset-4 transition-none hover:text-zinc-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Returns
            </Link>

          </div>

        </nav>


        {/* MELTED MINDZ */}

        <nav
          aria-label="Melted Mindz Records navigation"
          className="flex flex-col"
        >

          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-white">
            Melted Mindz Records
          </h2>

          <div className="flex flex-col gap-3">

            <a
              href="https://meltedmindzrecords.com"
              className="w-fit text-sm text-zinc-400 underline-offset-4 transition-none hover:text-zinc-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Main Website
            </a>

            <a
              href="https://meltedmindzrecords.com/contact"
              className="w-fit text-sm text-zinc-400 underline-offset-4 transition-none hover:text-zinc-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Contact
            </a>

          </div>

        </nav>

      </div>


      {/* BOTTOM BAR */}

      <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">

        <p>
          © 2026 Melted Mindz Records. All rights reserved.
        </p>

        <div className="flex flex-wrap gap-5">

          <Link
            href="/privacy"
            className="underline-offset-4 transition-none hover:text-zinc-500 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Privacy
          </Link>

          <Link
            href="/terms"
            className="underline-offset-4 transition-none hover:text-zinc-500 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Terms
          </Link>

        </div>

      </div>

    </div>

  </footer>

</main>

);
}