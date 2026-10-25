import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

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
  metadataBase: new URL("https://www.tillygallery.shop"),
  title: "Tilly's Gallery — Perfumes, Bags, Clothing & Beauty in Accra",
  description:
    "Perfumes, leather bags, tailored clothing, gold accessories and botanical beauty. Same-day delivery in Greater Accra, 48 hours across Ghana.",
  authors: [{ name: "Phinova", url: "https://phinova.dev" }],
  creator: "Phinova",
  manifest: "/manifest.webmanifest",
  applicationName: "Tilly's Gallery",
  icons: { apple: "/icons/apple-touch-icon.png" },
  appleWebApp: { capable: true, title: "Tilly's", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#6e564c",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${inter.variable} antialiased`}>{children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
