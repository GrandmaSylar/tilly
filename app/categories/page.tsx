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
      <Container className="pt-8 sm:pt-10">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">Categories</h1>
        <p className="mt-1 text-slate">{products.length} pieces across five categories.</p>
        <div className="mt-8">
          <CategoryGrid counts={counts} />
        </div>
      </Container>
      <PriceTiles />
    </main>
  );
}
