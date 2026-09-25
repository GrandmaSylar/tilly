import type { Metadata } from "next";
import { CATEGORIES, products } from "@/lib/products";
import { CategoryGrid, PriceTiles } from "@/components/home";
import { Container } from "@/components/Section";

export const metadata: Metadata = {
  title: "Categories — Tilly's Gallery",
  description: "Perfumes, bags, clothing, accessories and beauty.",
};

export default function CategoriesPage() {
  const counts = Object.fromEntries(CATEGORIES.map((c) => [c.name, products.filter((p) => p.category === c.name).length]));

  return (
    <main>
      <Container className="pt-6 sm:pt-10">
        <h1 className="font-display text-[clamp(1.6rem,1.1rem+2.4vw,2.25rem)] leading-tight font-bold tracking-tight text-ink">Categories</h1>
        <p className="mt-1 text-slate">{products.length} pieces across five categories.</p>
        <div className="mt-8">
          <CategoryGrid counts={counts} />
        </div>
      </Container>
      <PriceTiles />
    </main>
  );
}
