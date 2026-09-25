"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MagnifyingGlass, CaretDown, X } from "@phosphor-icons/react";
import { products, CATEGORIES, PRICE_TIERS, isLowStock } from "@/lib/products";
import { cedis } from "@/lib/format";
import { Container, ProductGrid } from "@/components/Section";

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most popular" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export function ShopView() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const category = params.get("category");
  const price = Number(params.get("price")) || null;
  const sale = params.get("sale") === "1";
  const lowStock = params.get("stock") === "low";
  const search = params.get("search") ?? "";
  const sort = params.get("sort") ?? "newest";

  function update(changes: Record<string, string | null>) {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
    }
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = products
      .map((p, index) => ({ p, index }))
      .filter(({ p }) => !category || p.category.toLowerCase() === category.toLowerCase())
      .filter(({ p }) => !price || p.price <= price)
      .filter(({ p }) => !sale || p.originalPrice)
      .filter(({ p }) => !lowStock || isLowStock(p))
      .filter(({ p }) => !q || `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(q));

    list.sort((a, b) => {
      if (sort === "price-asc") return a.p.price - b.p.price;
      if (sort === "price-desc") return b.p.price - a.p.price;
      if (sort === "popular") return Number(!!b.p.isBestseller) - Number(!!a.p.isBestseller) || a.index - b.index;
      return b.index - a.index; // newest: later catalogue entries arrived most recently
    });
    return list.map(({ p }) => p);
  }, [category, price, sale, lowStock, search, sort]);

  const filtersActive = !!(category || price || sale || lowStock || search);
  const title = category ?? (sale ? "Deals" : price ? `${cedis(price)} & below` : "Shop everything");

  return (
    <main>
      <Container className="pt-6 sm:pt-10">
        <h1 className="font-display text-[clamp(1.6rem,1.1rem+2.4vw,2.25rem)] leading-tight font-bold tracking-tight text-ink">{title}</h1>
        <p className="mt-1 text-base text-slate">
          {results.length} {results.length === 1 ? "piece" : "pieces"} · same-day delivery across Greater Accra
        </p>

        <div className="relative mt-5 sm:mt-6">
          <MagnifyingGlass size={18} className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-slate" />
          <input
            type="search"
            defaultValue={search}
            key={search}
            onKeyDown={(e) => e.key === "Enter" && update({ search: e.currentTarget.value.trim() })}
            onBlur={(e) => e.currentTarget.value.trim() !== search && update({ search: e.currentTarget.value.trim() })}
            placeholder="Search products or materials"
            aria-label="Search products"
            className="h-12 w-full rounded-full border border-line bg-white pr-5 pl-12 text-ink placeholder:text-slate focus:border-brand focus:outline-none"
          />
        </div>

        <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          <Chip active={!filtersActive} onClick={() => update({ category: null, price: null, sale: null, stock: null, search: null })}>
            All
          </Chip>
          {PRICE_TIERS.map((t) => (
            <Chip key={t.max} active={price === t.max} onClick={() => update({ price: price === t.max ? null : String(t.max) })}>
              {cedis(t.max)} &amp; below
            </Chip>
          ))}
          <Chip active={sale} onClick={() => update({ sale: sale ? null : "1" })}>
            On sale
          </Chip>
          <Chip active={lowStock} onClick={() => update({ stock: lowStock ? null : "low" })}>
            Almost gone
          </Chip>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            {CATEGORIES.map((c) => {
              const active = category?.toLowerCase() === c.name.toLowerCase();
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => update({ category: active ? null : c.name })}
                  aria-pressed={active}
                  className={`press h-11 shrink-0 rounded-full px-4 text-[15px] font-medium sm:text-sm ${
                    active ? "bg-ice text-brand" : "text-slate hover:text-brand"
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
          <label className="relative sm:ml-auto">
            <span className="sr-only">Sort by</span>
            <select
              value={sort}
              onChange={(e) => update({ sort: e.target.value === "newest" ? null : e.target.value })}
              className="h-11 w-full cursor-pointer appearance-none rounded-full border border-line bg-white pr-10 pl-4 text-base text-ink sm:w-auto sm:text-sm focus:border-brand focus:outline-none"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <CaretDown size={14} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-slate" />
          </label>
        </div>
      </Container>

      <Container className="mt-5 sm:mt-6">
        {results.length > 0 ? (
          <ProductGrid products={results} />
        ) : (
          <div className="flex flex-col items-center rounded-[1.75rem] border border-dashed border-line bg-white/70 px-5 py-14 text-center sm:rounded-[2rem] sm:px-6 sm:py-20">
            <p className="font-display text-2xl font-bold tracking-tight text-ink">Nothing matches that yet</p>
            <p className="mt-2 max-w-sm text-slate">
              {search ? `No pieces match "${search}" with these filters.` : "No pieces match these filters."} Clear them to see everything, or ask the concierge to source it.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/shop" className="press inline-flex h-11 items-center gap-2 rounded-full bg-brand px-5 font-semibold text-white">
                <X size={16} weight="bold" /> Clear filters
              </Link>
            </div>
          </div>
        )}
      </Container>
    </main>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`press h-11 shrink-0 rounded-full border px-4 text-sm font-semibold whitespace-nowrap ${
        active ? "border-brand bg-brand text-white" : "border-line bg-white text-ink hover:border-slate/50"
      }`}
    >
      {children}
    </button>
  );
}
