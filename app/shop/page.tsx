import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopView } from "@/components/ShopView";
import { Container } from "@/components/Section";

export const metadata: Metadata = {
  title: "Shop everything — Tilly's Gallery",
  description: "Perfumes, bags, clothing, accessories and beauty. Filter by price, category and deals.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopView />
    </Suspense>
  );
}

function ShopSkeleton() {
  return (
    <Container className="pt-10">
      <div className="h-9 w-56 animate-pulse rounded-xl bg-ice" />
      <div className="mt-6 h-12 animate-pulse rounded-full bg-ice" />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] animate-pulse rounded-[1.25rem] bg-ice" />
        ))}
      </div>
    </Container>
  );
}
