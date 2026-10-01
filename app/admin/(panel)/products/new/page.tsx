import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/ProductForm";
import { PageTitle } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Add product" };

export default function NewProductPage() {
  return (
    <>
      <PageTitle title="Add product" subtitle="It goes live on the store as soon as you save." />
      <ProductForm />
    </>
  );
}
