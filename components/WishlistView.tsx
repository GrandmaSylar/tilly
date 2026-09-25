"use client";

import Link from "next/link";
import { Heart } from "@phosphor-icons/react";
import { products } from "@/lib/products";
import { useWishlist } from "@/context/WishlistContext";
import { Container, ProductGrid } from "@/components/Section";

export function WishlistView() {
  const { slugs } = useWishlist();
  const saved = products.filter((p) => slugs.includes(p.slug));

  return (
    <main>
      <Container className="pt-6 sm:pt-10">
        <h1 className="font-display text-[clamp(1.6rem,1.1rem+2.4vw,2.25rem)] leading-tight font-bold tracking-tight text-ink">Wishlist</h1>
        <p className="mt-1 text-slate">
          {saved.length > 0 ? `${saved.length} saved ${saved.length === 1 ? "piece" : "pieces"}, kept on this device.` : "Saved pieces stay on this device."}
        </p>
        <div className="mt-8">
          {saved.length > 0 ? (
            <ProductGrid products={saved} />
          ) : (
            <div className="flex flex-col items-center rounded-[1.75rem] border border-dashed border-line bg-white/70 px-5 py-14 text-center sm:rounded-[2rem] sm:px-6 sm:py-20">
              <span className="grid size-14 place-items-center rounded-full bg-ice text-brand">
                <Heart size={26} />
              </span>
              <p className="mt-5 font-display text-2xl font-bold tracking-tight text-ink">Nothing saved yet</p>
              <p className="mt-2 max-w-sm text-slate">Tap the heart on any piece to keep it here for later.</p>
              <Link
                href="/shop"
                className="press mt-6 inline-flex h-11 items-center rounded-full bg-brand px-6 font-semibold text-white hover:bg-brand-soft"
              >
                Browse the shop
              </Link>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
