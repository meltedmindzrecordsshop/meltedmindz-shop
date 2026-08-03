import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./Navbar";
import { CartProvider } from "./context/CartContext";
import "./globals.css";

const geistSans = Geist({
variable: "--font-geist-sans",
subsets: ["latin"],
});

const geistMono = Geist_Mono({
variable: "--font-geist-mono",
subsets: ["latin"],
});

export const metadata: Metadata = {
metadataBase: new URL("https://shop.meltedmindzrecords.com"),

title: {
default: "Melted Mindz Shop",
template: "%s | Melted Mindz Shop",
},

description:
"Official merchandise from Melted Mindz Records and its artists.",

applicationName: "Melted Mindz Shop",

keywords: [
"Melted Mindz Records",
"Melted Mindz",
"Melted Mindz merchandise",
"Melted Mindz shop",
"music merchandise",
"artist merchandise",
],

openGraph: {
title: "Melted Mindz Shop",
description:
"Official merchandise from Melted Mindz Records and its artists.",
url: "https://shop.meltedmindzrecords.com",
siteName: "Melted Mindz Shop",
type: "website",
},

twitter: {
card: "summary_large_image",
title: "Melted Mindz Shop",
description:
"Official merchandise from Melted Mindz Records and its artists.",
},

robots: {
index: true,
follow: true,
},
};

export default function RootLayout({
children,
}: Readonly<{
children: React.ReactNode;
}>) {
return (
<html lang="en">
<body className="min-h-screen bg-black font-sans text-white antialiased">
<CartProvider>
<Navbar />

      <main className="min-h-[calc(100vh-5rem)]">
        {children}
      </main>
    </CartProvider>
  </body>
</html>

);
}