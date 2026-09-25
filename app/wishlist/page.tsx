import type { Metadata } from "next";
import { WishlistView } from "@/components/WishlistView";

export const metadata: Metadata = {
  title: "Wishlist — Tilly's Gallery",
};

export default function WishlistPage() {
  return <WishlistView />;
}
