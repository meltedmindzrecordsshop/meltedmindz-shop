import Link from "next/link";

export default function AccessoriesPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
            Melted Mindz Records
          </p>

          <h1 className="mt-4 text-5xl font-black uppercase tracking-tight sm:text-6xl md:text-7xl">
            Accessories
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-zinc-400 md:text-base">
            Official Melted Mindz Records accessories are coming soon.
            Check back as we expand the official Melted Mindz shop.
          </p>
        </div>
      </section>

      <section className="mx-auto flex min-h-[45vh] max-w-7xl items-center px-6 py-20 md:px-10">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
            Coming Soon
          </p>

          <h2 className="mt-4 text-4xl font-black uppercase tracking-tight sm:text-5xl">
            More Melted Mindz
          </h2>

          <p className="mt-6 text-sm leading-7 text-zinc-400 md:text-base">
            We're working on additional official Melted Mindz Records
            accessories. New products will be added to this collection
            as they become available.
          </p>

          <Link
            href="/collections/apparel"
            className="mt-8 inline-flex min-h-[52px] items-center justify-center border-2 border-white bg-white px-7 py-4 text-xs font-black uppercase tracking-[0.2em] text-black transition-opacity hover:opacity-80"
          >
            Shop Apparel
          </Link>
        </div>
      </section>
    </main>
  );
}