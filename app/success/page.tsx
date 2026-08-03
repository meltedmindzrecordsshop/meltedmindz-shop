"use client";

import Link from "next/link";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";

export default function SuccessPage() {
return (
<main className="flex min-h-screen items-center justify-center bg-black px-6 py-16 text-white" aria-labelledby="success-heading" >
<div className="w-full max-w-xl text-center">

    {/* SUCCESS ICON */}

    <div
      className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-green-500/40 bg-green-500/10"
      aria-hidden="true"
    >
      <CheckCircle2
        size={58}
        strokeWidth={2}
        className="text-green-400"
      />
    </div>


    {/* SUCCESS MESSAGE */}

    <div
      role="status"
      aria-live="polite"
      className="space-y-4"
    >

      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-green-400">
        Payment Successful
      </p>

      <h1
        id="success-heading"
        className="text-4xl font-black uppercase tracking-tight text-white sm:text-5xl"
      >
        Order Confirmed
      </h1>

    </div>


    {/* DESCRIPTION */}

    <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-zinc-300">
      Thank you for supporting Melted Mindz Records. Your order has been
      successfully received.
    </p>


    {/* ORDER SUMMARY */}

    <section
      aria-labelledby="order-summary-heading"
      className="mx-auto mt-10 max-w-md rounded-2xl border border-white/20 bg-zinc-950 p-6 text-left"
    >

      <h2
        id="order-summary-heading"
        className="sr-only"
      >
        Order Summary
      </h2>

      <div className="flex items-start gap-4">

        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white"
          aria-hidden="true"
        >
          <Package
            size={22}
            className="text-black"
          />
        </div>

        <div>

          <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-white">
            Melted Mindz Records T-Shirt
          </h3>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Your payment has been processed successfully.
          </p>

        </div>

      </div>

    </section>


    {/* EMAIL MESSAGE */}

    <p className="mt-8 text-sm leading-6 text-zinc-400">
      A confirmation will be sent to the email address provided during
      checkout.
    </p>


    {/* NAVIGATION */}

    <nav
      aria-label="After purchase options"
      className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center"
    >

      {/* CONTINUE SHOPPING */}

      <Link
        href="/"
        aria-label="Continue shopping at Melted Mindz Records"
        className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-md border-2 border-white bg-black px-7 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white transition-none hover:border-white hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-black"
      >
        Continue Shopping

        <ArrowRight
          size={18}
          strokeWidth={2.5}
          aria-hidden="true"
        />

      </Link>


      {/* MELTED MINDZ RECORDS */}

      <Link
        href="/"
        aria-label="Return to the Melted Mindz Records homepage"
        className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-md border-2 border-white bg-black px-7 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white transition-none hover:border-white hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-black"
      >
        Melted Mindz Records
      </Link>

    </nav>


    {/* ACCESSIBILITY-FRIENDLY CONFIRMATION */}

    <p className="sr-only">
      Your payment was successful. Your Melted Mindz Records T-Shirt order
      has been confirmed. A confirmation will be sent to the email address
      provided during checkout.
    </p>

  </div>
</main>

);
}