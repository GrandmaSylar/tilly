"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check } from "@phosphor-icons/react";
import { productImageSrc, type Product } from "@/lib/products";
import { cedis } from "@/lib/format";
import { useCart } from "@/context/CartContext";

export function BundlePanel({ title, products }: { title: string; products: Product[] }) {
  const { addItem, openCart } = useCart();
  const [added, setAdded] = useState(false);
  const total = products.reduce((sum, p) => sum + p.price, 0);

  function addAll() {
    products.forEach((p) =>
      addItem({ slug: p.slug, name: p.name, price: p.price, size: p.sizes?.[0] ?? "One Size", image: productImageSrc(p.slug) })
    );
    setAdded(true);
    openCart();
    window.setTimeout(() => setAdded(false), 2400);
  }

  return (
    <div className="rounded-[2rem] border border-mint/30 bg-[linear-gradient(135deg,oklch(77.33%_0.1736_160.47/0.14),oklch(97.05%_0.0092_257.2)_55%,white)] p-5 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-2xl font-bold tracking-tight text-ink uppercase sm:text-3xl">{title}</h2>
        <div className="text-right">
          <p className="text-xs text-slate">{products.length} pieces · total</p>
          <p className="tabular font-display text-3xl font-bold tracking-tight text-ink">{cedis(total)}</p>
        </div>
      </div>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/shop/${p.slug}`}
              className="press flex items-center gap-3 rounded-2xl border border-line bg-white p-2.5 hover:border-slate/40"
            >
              <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-ice">
                <Image src={productImageSrc(p.slug)} alt="" fill sizes="56px" className="object-cover" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-ink">{p.name}</span>
                <span className="tabular text-sm text-slate">{cedis(p.price)}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={addAll}
        className="press mt-5 flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-brand font-semibold text-white uppercase hover:bg-brand-soft"
      >
        {added ? (
          <>
            <Check size={18} weight="bold" className="text-mint" /> Added to cart
          </>
        ) : (
          "Add all to cart"
        )}
      </button>
    </div>
  );
}
