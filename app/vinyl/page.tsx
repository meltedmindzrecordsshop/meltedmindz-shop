import Link from "next/link";

type Record = {
id: string;
artist: string;
title: string;
format: string;
price: string;
};

const records: Record[] = [
{
id: "01",
artist: "Yxng Dreezy",
title: "TBD",
format: '12" LP',
price: "$—",
},
{
id: "02",
artist: "Snowwy",
title: "TBD",
format: '12" LP',
price: "$—",
},
{
id: "03",
artist: "Young Eli",
title: "TBD",
format: '12" LP',
price: "$—",
},
{
id: "04",
artist: "Yvng Kobe",
title: "TBD",
format: '12" LP',
price: "$—",
},
];

export default function VinylPage() {
return (
<main className="min-h-screen bg-black text-white">

  {/* HERO */}

  <section className="border-b border-white/10">
    <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-32">

      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-400">
        Melted Mindz Records
      </p>

      <h1 className="mt-6 text-6xl font-black uppercase leading-[0.9] tracking-tight sm:text-7xl md:text-9xl">
        Vinyl
      </h1>

      <p className="mt-8 max-w-2xl text-base leading-7 text-zinc-300 md:text-lg">
        Official vinyl pressings from the Melted Mindz roster. Limited
        runs, collector editions, and label exclusives on wax.
      </p>

    </div>
  </section>


  {/* PRODUCT GRID */}

  <section
    aria-labelledby="vinyl-heading"
    className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28"
  >

    <h2 id="vinyl-heading" className="sr-only">
      Melted Mindz Records Vinyl Collection
    </h2>

    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

      {records.map((record) => (

        <div
          key={record.id}
          className="group relative flex min-h-[420px] flex-col justify-between overflow-hidden border-2 border-white/20 bg-zinc-950 p-8"
        >

          <div className="flex items-start justify-between gap-4">

            <span className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-300">
              {record.id}
            </span>

            <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-300">
              {record.format}
            </span>

          </div>


          {/* VINYL SLEEVE PLACEHOLDER */}

          <div
            className="my-6 aspect-square w-full border border-white/20 bg-zinc-900"
            aria-label={`${record.artist} vinyl sleeve placeholder`}
            role="img"
          />


          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-300">
              {record.artist}
            </p>

            <h3 className="mt-2 text-2xl font-black uppercase tracking-tight text-white">
              {record.title}
            </h3>

            <div className="mt-5 flex items-center justify-between gap-4">

              <span className="text-sm font-semibold text-zinc-200">
                {record.price}
              </span>

              <span className="rounded-md border border-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white">
                Add to Cart →
              </span>

            </div>

          </div>

        </div>

      ))}

    </div>

  </section>


  {/* STORE STATEMENT */}

  <section className="border-y border-white/10">

    <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">

      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
        On Wax
      </p>

      <h2 className="mt-5 max-w-5xl text-4xl font-black uppercase leading-tight tracking-tight text-white md:text-6xl">
        Pressed for the collectors.
      </h2>

      <p className="mt-6 max-w-2xl text-sm leading-7 text-zinc-300 md:text-base">
        Every Melted Mindz vinyl release is limited and numbered.
        Once it's gone, it's gone.
      </p>

      <Link
        href="/collections"
        className="mt-8 inline-flex min-h-[48px] items-center rounded-md border-2 border-white bg-black px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-black"
      >
        ← Back to Collections
      </Link>

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
              className="w-fit text-sm text-zinc-400 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Shop
            </Link>

            <Link
              href="/collections"
              className="w-fit text-sm text-zinc-400 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Collections
            </Link>

            <Link
              href="/shipping"
              className="w-fit text-sm text-zinc-400 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Shipping
            </Link>

            <Link
              href="/returns"
              className="w-fit text-sm text-zinc-400 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
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
              className="w-fit text-sm text-zinc-400 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Main Website
            </a>

            <a
              href="https://meltedmindzrecords.com/contact"
              className="w-fit text-sm text-zinc-400 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Contact
            </a>

          </div>

        </nav>

      </div>


      {/* BOTTOM BAR */}

      <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-zinc-400 sm:flex-row sm:items-center sm:justify-between">

        <p>
          © 2026 Melted Mindz Records. All rights reserved.
        </p>

        <div className="flex flex-wrap gap-5">

          <Link
            href="/privacy"
            className="underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Privacy
          </Link>

          <Link
            href="/terms"
            className="underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
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