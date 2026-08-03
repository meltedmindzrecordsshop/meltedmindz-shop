"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Search, ShoppingBag } from "lucide-react";
import { useCart } from "./context/CartContext";

export default function Navbar() {
const [menuOpen, setMenuOpen] = useState(false);
const { cartCount } = useCart();

return (
<header className="sticky top-0 z-50 border-b border-white/10 bg-black text-white">
<div className="mx-auto flex h-20 max-w-7xl items-center px-6 md:px-10">

    {/* LOGO */}

    <Link
      href="/"
      aria-label="Melted Mindz Records Store homepage"
      className="flex shrink-0 items-center rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      <Image
        src="/logo/Melted.Mindz.Records-Logo.jpg"
        alt="Melted Mindz Records"
        width={180}
        height={60}
        priority
        className="h-auto max-h-12 w-auto object-contain"
      />
    </Link>


    {/* DESKTOP NAVIGATION */}

    <nav
      aria-label="Main store navigation"
      className="ml-8 hidden items-center gap-7 lg:flex"
    >
      <Link
        href="/"
        className="text-xs font-bold uppercase tracking-[0.16em] text-white underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        Shop
      </Link>

      <Link
        href="/collections"
        className="text-xs font-bold uppercase tracking-[0.16em] text-white underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        Collections
      </Link>

      <Link
        href="/vinyl"
        className="text-xs font-bold uppercase tracking-[0.16em] text-white underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        Vinyl
      </Link>

      <Link
        href="/collections/apparel"
        className="text-xs font-bold uppercase tracking-[0.16em] text-white underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        Apparel
      </Link>

      <Link
        href="/collections/accessories"
        className="text-xs font-bold uppercase tracking-[0.16em] text-white underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        Accessories
      </Link>
    </nav>


    {/* RIGHT SIDE */}

    <div className="ml-auto flex items-center gap-3">

      {/* SEARCH */}

      <button
        type="button"
        aria-label="Search the store"
        className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-white transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      >
        <Search
          size={22}
          strokeWidth={2}
          aria-hidden="true"
        />
      </button>


      {/* SHOPPING BAG */}

      <Link
        href="/cart"
        aria-label={`Shopping cart, ${cartCount} ${
          cartCount === 1 ? "item" : "items"
        }`}
        className="flex min-h-[44px] items-center gap-1.5 rounded-md px-1 text-white transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      >
        <ShoppingBag
          size={22}
          strokeWidth={2}
          aria-hidden="true"
        />

        <span
          aria-hidden="true"
          className="text-xs font-bold tabular-nums"
        >
          {cartCount}
        </span>

        <span className="sr-only">
          {cartCount} {cartCount === 1 ? "item" : "items"} in cart
        </span>
      </Link>


      {/* MOBILE MENU */}

      <button
        type="button"
        aria-expanded={menuOpen}
        aria-controls="mobile-store-menu"
        aria-label={menuOpen ? "Close store menu" : "Open store menu"}
        onClick={() => setMenuOpen(!menuOpen)}
        className="ml-2 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-white px-3 text-xs font-bold uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black lg:hidden"
      >
        {menuOpen ? "Close" : "Menu"}
      </button>

    </div>

  </div>


  {/* MOBILE MENU */}

  {menuOpen && (
    <nav
      id="mobile-store-menu"
      aria-label="Mobile store navigation"
      className="border-t border-white/10 bg-black lg:hidden"
    >
      <div className="mx-auto flex max-w-7xl flex-col px-6 py-6">

        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="border-b border-white/10 py-5 text-sm font-bold uppercase tracking-[0.2em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Shop
        </Link>

        <Link
          href="/collections"
          onClick={() => setMenuOpen(false)}
          className="border-b border-white/10 py-5 text-sm font-bold uppercase tracking-[0.2em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Collections
        </Link>

        <Link
          href="/vinyl"
          onClick={() => setMenuOpen(false)}
          className="border-b border-white/10 py-5 text-sm font-bold uppercase tracking-[0.2em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Vinyl
        </Link>

        <Link
          href="/collections/apparel"
          onClick={() => setMenuOpen(false)}
          className="border-b border-white/10 py-5 text-sm font-bold uppercase tracking-[0.2em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Apparel
        </Link>

        <Link
          href="/collections/accessories"
          onClick={() => setMenuOpen(false)}
          className="border-b border-white/10 py-5 text-sm font-bold uppercase tracking-[0.2em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Accessories
        </Link>

        <Link
          href="/cart"
          onClick={() => setMenuOpen(false)}
          aria-label={`Shopping cart, ${cartCount} ${
            cartCount === 1 ? "item" : "items"
          }`}
          className="flex items-center gap-3 py-5 text-sm font-bold uppercase tracking-[0.2em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <ShoppingBag
            size={20}
            strokeWidth={2}
            aria-hidden="true"
          />

          Cart ({cartCount})
        </Link>

      </div>
    </nav>
  )}

</header>

);
}