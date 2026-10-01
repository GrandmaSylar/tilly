import type { Metadata } from "next";
import { WishlistView } from "@/components/WishlistView";
import { getProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Wishlist — Tilly's Gallery",
};

export default async function WishlistPage() {
  return <WishlistView products={await getProducts()} />;
}
