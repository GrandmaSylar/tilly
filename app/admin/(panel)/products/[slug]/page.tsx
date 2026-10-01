import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchProducts } from "@/lib/catalog";
import { ProductForm } from "@/components/admin/ProductForm";
import { PageTitle } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Edit product" };

export default async function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = (await fetchProducts()).find((p) => p.slug === slug);
  if (!product) notFound();

  return (
    <>
      <PageTitle title={product.name} subtitle="Changes go live on the store as soon as you save." />
      <ProductForm product={product} />
    </>
  );
}
