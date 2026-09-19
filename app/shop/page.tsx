"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Minus, Funnel, X } from "@phosphor-icons/react";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

const CATEGORIES = ["Perfumes", "Bags", "Clothing", "Accessories", "Beauty"] as const;
const SIZES = ["XS", "S", "M", "L", "XL"] as const;

const SORT_OPTIONS = [
  { label: "Curated / Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest Arrivals", value: "newest" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");

  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [sort, setSort] = useState<SortValue>("featured");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  useEffect(() => {
    if (categoryParam) {
      setActiveCategories([categoryParam]);
    }
  }, [categoryParam]);

  function toggleCategory(category: string) {
    setActiveCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    );
  }

  function clearAllFilters() {
    setActiveCategories([]);
    setSelectedPriceRange(null);
  }

  const visibleProducts = useMemo(() => {
    let result = products;

    if (searchParam) {
      const q = searchParam.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (activeCategories.length > 0) {
      result = result.filter((product) => activeCategories.includes(product.category));
    }

    if (selectedPriceRange === "under-1000") {
      result = result.filter((p) => p.price < 1000);
    } else if (selectedPriceRange === "1000-3000") {
      result = result.filter((p) => p.price >= 1000 && p.price <= 3000);
    } else if (selectedPriceRange === "over-3000") {
      result = result.filter((p) => p.price > 3000);
    }

    if (sort === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sort === "newest") {
      result = [...result].reverse();
    }

    return result;
  }, [activeCategories, selectedPriceRange, sort, searchParam]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-8 md:py-12 bg-ecru text-off-black">
      {/* Title & Filter Header */}
      <div className="flex flex-col gap-4 border-b border-border-dark pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-xs font-semibold tracking-widest text-bronze uppercase">
            Ghana Flagship Edit
          </span>
          <h1 className="font-display text-4xl font-light text-off-black md:text-6xl mt-1">
            {searchParam ? `Results for "${searchParam}"` : categoryParam ? `${categoryParam} Edit` : "The Complete Collection"}
          </h1>
          <p className="mt-2 text-xs text-stone">
            Showing {visibleProducts.length} of {products.length} curated luxury pieces
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setIsFilterDrawerOpen(true)}
            className="active-tactile flex items-center gap-2 border border-border-dark bg-cream px-4 py-2.5 text-xs font-medium tracking-widest text-off-black uppercase md:hidden"
          >
            <Funnel size={16} />
            Filter & Sort
          </button>

          {/* Desktop Sort Selector */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-stone uppercase tracking-wider">Sort by:</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortValue)}
              className="border border-border-dark bg-cream px-3 py-2 text-xs font-medium text-off-black focus:outline-none"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {(activeCategories.length > 0 || selectedPriceRange || searchParam) && (
        <div className="flex flex-wrap items-center gap-2 py-4 border-b border-border-light text-xs">
          <span className="text-stone uppercase tracking-widest text-[10px]">Active Filters:</span>
          {activeCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className="active-tactile inline-flex items-center gap-1.5 bg-cream border border-border-dark px-3 py-1 text-off-black text-xs font-medium"
            >
              {cat} <X size={12} />
            </button>
          ))}
          {selectedPriceRange && (
            <button
              onClick={() => setSelectedPriceRange(null)}
              className="active-tactile inline-flex items-center gap-1.5 bg-cream border border-border-dark px-3 py-1 text-off-black text-xs font-medium"
            >
              {selectedPriceRange === "under-1000" && "< GH₵ 1,000"}
              {selectedPriceRange === "1000-3000" && "GH₵ 1,000 - 3,000"}
              {selectedPriceRange === "over-3000" && "> GH₵ 3,000"}
              <X size={12} />
            </button>
          )}
          <button
            onClick={clearAllFilters}
            className="text-xs text-bronze underline ml-2 hover:text-off-black"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Catalog Layout */}
      <div className="flex gap-12 py-10 md:py-16">
        {/* Desktop Sticky Filter Sidebar */}
        <aside className="sticky top-28 hidden h-fit w-[240px] shrink-0 md:block">
          <div className="border border-border-dark bg-cream p-6">
            <h2 className="font-display text-lg font-light text-off-black mb-4 pb-2 border-b border-border-light">
              Filter Collection
            </h2>
            <FilterPanel
              activeCategories={activeCategories}
              onToggleCategory={toggleCategory}
              selectedPriceRange={selectedPriceRange}
              onSelectPriceRange={setSelectedPriceRange}
            />
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {visibleProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center border border-border-dark bg-cream p-12">
              <p className="font-display text-2xl font-light text-off-black">No products found matching your selection</p>
              <p className="mt-2 text-xs text-stone max-w-sm">Try resetting filters or searching for alternative categories like Perfumes or Bags.</p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="active-tactile mt-6 border border-off-black bg-off-black px-6 py-3 text-xs tracking-widest uppercase text-ecru"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 xl:grid-cols-4 md:gap-x-6 md:gap-y-12">
              {visibleProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-16 flex items-center justify-center gap-6 border-t border-border-light pt-8 text-xs tracking-widest text-stone uppercase">
            <span className="text-off-black font-semibold">1 of 1 Page</span>
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer Bottom Sheet */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity duration-300 md:hidden ${
          isFilterDrawerOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsFilterDrawerOpen(false)}
      />

      <div
        className={`fixed right-0 bottom-0 left-0 z-50 max-h-[85vh] overflow-y-auto border-t border-border-dark bg-ecru px-6 pt-6 pb-12 shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          isFilterDrawerOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between pb-6 border-b border-border-light">
          <h2 className="font-display text-xl font-light text-off-black">Filter & Sort Collection</h2>
          <button
            type="button"
            onClick={() => setIsFilterDrawerOpen(false)}
            aria-label="Close filters"
            className="p-1 text-off-black"
          >
            <X size={20} />
          </button>
        </div>

        <div className="py-4 border-b border-border-light">
          <label className="text-xs font-medium tracking-widest text-off-black uppercase block mb-2">Sort By</label>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortValue)}
            className="w-full border border-border-dark bg-cream p-3 text-xs font-medium text-off-black"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="py-4">
          <FilterPanel
            activeCategories={activeCategories}
            onToggleCategory={toggleCategory}
            selectedPriceRange={selectedPriceRange}
            onSelectPriceRange={setSelectedPriceRange}
          />
        </div>

        <button
          type="button"
          onClick={() => setIsFilterDrawerOpen(false)}
          className="active-tactile mt-6 w-full bg-off-black py-4 text-xs font-medium tracking-widest text-ecru uppercase"
        >
          Apply Filters ({visibleProducts.length} Results)
        </button>
      </div>
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-stone">Loading Tilly&apos;s Collection...</div>}>
      <ShopContent />
    </Suspense>
  );
}

function FilterPanel({
  activeCategories,
  onToggleCategory,
  selectedPriceRange,
  onSelectPriceRange,
}: {
  activeCategories: string[];
  onToggleCategory: (category: string) => void;
  selectedPriceRange: string | null;
  onSelectPriceRange: (range: string | null) => void;
}) {
  return (
    <div className="flex flex-col divide-y divide-border-light">
      <FilterSection title="Category" defaultOpen>
        <div className="flex flex-col gap-2.5">
          {CATEGORIES.map((category) => (
            <label key={category} className="flex items-center gap-3 text-xs text-off-black cursor-pointer hover:text-bronze">
              <input
                type="checkbox"
                checked={activeCategories.includes(category)}
                onChange={() => onToggleCategory(category)}
                className="accent-off-black h-4 w-4 rounded-none"
              />
              <span className={activeCategories.includes(category) ? "font-semibold" : ""}>{category}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price Range (GH₵)" defaultOpen>
        <div className="flex flex-col gap-2 text-xs text-off-black">
          {[
            { label: "All Prices", value: null },
            { label: "Under GH₵ 1,000", value: "under-1000" },
            { label: "GH₵ 1,000 – 3,000", value: "1000-3000" },
            { label: "Over GH₵ 3,000", value: "over-3000" },
          ].map((option) => (
            <label key={option.label} className="flex items-center gap-3 cursor-pointer py-1">
              <input
                type="radio"
                name="priceRange"
                checked={selectedPriceRange === option.value}
                onChange={() => onSelectPriceRange(option.value)}
                className="accent-off-black"
              />
              <span className={selectedPriceRange === option.value ? "font-semibold text-bronze" : ""}>{option.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Available Sizes">
        <div className="flex flex-wrap gap-2 pt-1">
          {SIZES.map((size) => (
            <span
              key={size}
              className="border border-border-dark px-3 py-1 text-[11px] text-stone bg-ecru"
            >
              {size}
            </span>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}

function FilterSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="py-5 first:pt-0">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex w-full items-center justify-between text-xs font-medium tracking-widest text-off-black uppercase"
      >
        {title}
        {isOpen ? <Minus size={14} /> : <Plus size={14} />}
      </button>

      {isOpen && <div className="mt-4">{children}</div>}
    </div>
  );
}

