import type { Metadata } from "next";
import { Cormorant_Garamond, Geist } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tilly's Gallery — Ghana's Premier Luxury Maison",
  description:
    "An edit of fine perfumes, leather craft, tailored silhouettes, and high beauty — crafted with intention for Accra & beyond.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorantGaramond.variable} ${geist.variable} bg-ecru text-off-black antialiased`}
      >
        <CartProvider>
          {/* Ghana Market Top Announcement Bar */}
          <div className="bg-off-black py-2 px-4 text-center text-[11px] uppercase tracking-widest text-ecru font-light">
            <span>Express Delivery Across Accra & Greater Ghana</span>
            <span className="mx-3 opacity-40">|</span>
            <span className="hidden sm:inline">Complimentary Gift Packaging with Every Order</span>
          </div>

          <Navbar />
          {children}
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
