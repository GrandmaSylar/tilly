import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CartDrawer } from "@/components/CartDrawer";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tilly's Gallery — Perfumes, Bags, Clothing & Beauty in Accra",
  description:
    "Perfumes, leather bags, tailored clothing, gold accessories and botanical beauty. Same-day delivery in Greater Accra, 48 hours across Ghana.",
};

export const viewport: Viewport = {
  themeColor: "#0b1b33",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${inter.variable} antialiased`}>
        <CartProvider>
          <WishlistProvider>
            <div className="bg-brand text-white">
              <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
                <p className="font-display text-[11px] font-bold uppercase tracking-[0.08em]">
                  Same-day delivery across Greater Accra
                </p>
                <p className="hidden text-[11px] font-semibold uppercase tracking-[0.06em] text-mint sm:block">
                  48 hours anywhere in Ghana
                </p>
              </div>
            </div>
            <Navbar />
            {children}
            <Footer />
            <CartDrawer />
            <WhatsAppFloat />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
