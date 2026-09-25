import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, products } from "@/lib/products";
import { ProductDetail } from "@/components/ProductDetail";
import { ProductRow } from "@/components/Section";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Product not found — Tilly's Gallery" };
  }

  return {
    title: `${product.name} — Tilly's Gallery`,
    description: `${product.description} Same-day delivery across Greater Accra.`,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const others = products.filter((p) => p.slug !== product.slug);
  const related = [
    ...others.filter((p) => p.category === product.category),
    ...others.filter((p) => p.category !== product.category && p.isBestseller),
    ...others,
  ]
    .filter((p, i, list) => list.findIndex((q) => q.slug === p.slug) === i)
    .slice(0, 4);

  return (
    <>
      <ProductDetail product={product} />
      <ProductRow title="You may also like" href={`/shop?category=${product.category}`} products={related} />
    </>
  );
}
