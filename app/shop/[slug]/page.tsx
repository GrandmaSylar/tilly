import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, products } from "@/lib/products";
import { ProductDetail } from "@/components/ProductDetail";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found — Tilly's Gallery" };
  }

  return {
    title: `${product.name} — Tilly's Gallery Accra`,
    description: `${product.description} Available for express delivery across Greater Accra & nationwide Ghana.`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}

