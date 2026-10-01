import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { fetchProducts } from "@/lib/catalog";
import { ProductTable } from "@/components/admin/ProductTable";
import { PageTitle, primaryButton } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Products" };

export default async function AdminProductsPage() {
  const products = await fetchProducts();

  return (
    <>
      <PageTitle
        title="Products"
        subtitle={`${products.length} ${products.length === 1 ? "product" : "products"} in the catalogue`}
        action={
          <Link href="/admin/products/new" className={primaryButton}>
            <Plus size={18} weight="bold" /> Add product
          </Link>
        }
      />
      <Suspense>
        <ProductTable products={products} />
      </Suspense>
    </>
  );
}
