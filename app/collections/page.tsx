import Link from "next/link";

const collections = [
{
number: "01",
category: "Clothing",
title: "Apparel",
description:
"T-shirts, hoodies, and official Melted Mindz Records clothing.",
href: "/collections/apparel",
},
{
number: "02",
category: "Physical Music",
title: "Vinyl",
description:
"Vinyl records, special pressings, limited editions, and collector releases.",
href: "/vinyl",
},
{
number: "03",
category: "Physical Releases",
title: "Music",
description:
"CDs, physical releases, special editions, and music collectibles.",
href: "/collections/music",
},
{
number: "04",
category: "Extras",
title: "Accessories",
description:
"Hats, bags, collectibles, and other official Melted Mindz accessories.",
href: "/collections/accessories",
},
];

export default function CollectionsPage() {
return (
<main className="min-h-screen bg-black text-white">

  {/* HERO */}

  <section className="border-b border-white/10">
    <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-32">

      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-400">
        Melted Mindz Records
      </p>

      <h1 className="mt-6 text-6xl font-black uppercase leading-[0.9] tracking-tight sm:text-7xl md:text-9xl">
        Collections
      </h1>

      <p className="mt-8 max-w-2xl text-base leading-7 text-zinc-300 md:text-lg">
        Explore the official Melted Mindz Records store. Shop apparel,
        vinyl, music, accessories, and exclusive merchandise from the
        label and its artists.
      </p>

    </div>
  </section>


  {/* COLLECTION GRID */}

  <section
    aria-labelledby="collections-heading"
    className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28"
  >

    <h2 id="collections-heading" className="sr-only">
      Store Collections
    </h2>

    <div className="grid gap-5 md:grid-cols-2">

      {collections.map((collection) => (

        <Link
          key={collection.href}
          href={collection.href}
          aria-label={`Shop ${collection.title}`}
          className="group relative min-h-[500px] overflow-hidden border-2 border-white/20 bg-zinc-950 p-8 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-black md:p-12"
        >

          <div className="flex h-full flex-col justify-between">

            {/* TOP */}

            <div className="flex items-start justify-between gap-6">

              <span className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-300">
                {collection.number}
              </span>

              <span className="rounded-md border border-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white">
                Shop →
              </span>

            </div>


            {/* CONTENT */}

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-300">
                {collection.category}
              </p>

              <h3 className="mt-3 text-5xl font-black uppercase tracking-tight text-white md:text-7xl">
                {collection.title}
              </h3>

              <p className="mt-5 max-w-md text-sm leading-7 text-zinc-300">
                {collection.description}
              </p>

            </div>

          </div>

        </Link>

      ))}

    </div>

  </section>


    {/* STORE STATEMENT */}

  <section className="border-y border-white/10">
    <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">

      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
        Official Store
      </p>

      <h2 className="mt-5 max-w-5xl text-4xl font-black uppercase leading-tight tracking-tight md:text-6xl">
        Music. Merchandise. Mindz.
      </h2>

      <p className="mt-6 max-w-2xl text-sm leading-7 text-zinc-500 md:text-base">
        The official home for Melted Mindz Records merchandise and
        physical releases.
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
              href="/collections"
              className="w-fit text-sm text-zinc-400 underline-offset-4 transition-none hover:text-zinc-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Collections
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