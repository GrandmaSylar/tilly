import Link from "next/link";
import type { ReactNode } from "react";
import type { Product } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export function SectionHeader({ title, href, linkLabel = "View all" }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <h2 className="font-display text-[clamp(1.3rem,1rem+1.2vw,1.5rem)] leading-tight font-bold tracking-tight text-balance text-ink">{title}</h2>
      {href && (
        <Link href={href} className="group -my-3 -mr-2 inline-flex min-h-11 shrink-0 items-center rounded-full px-2 text-[15px] text-slate transition-colors hover:text-brand active:text-brand sm:text-sm">
          {linkLabel}{" "}
          <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
        </Link>
      )}
    </div>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-7xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}

export function ProductRow({ title, href, products }: { title: string; href?: string; products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section className="mt-12 sm:mt-20">
      <Container>
        <SectionHeader title={title} href={href} />
        <ProductGrid products={products} />
      </Container>
    </section>
  );
}
