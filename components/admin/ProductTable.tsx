"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, MagnifyingGlass, Minus, PencilSimple, Plus, Trash, X } from "@phosphor-icons/react";
import { CATEGORIES, isLowStock, isSoldOut, productImageSrc, type Product } from "@/lib/products";
import { cedis } from "@/lib/format";
import { deleteProduct, setStock, toggleFlag } from "@/app/admin/actions";
import { dangerButton, inputClass, secondaryButton } from "@/components/admin/ui";

const STOCK_FILTERS = [
  { value: "", label: "All stock" },
  { value: "low", label: "Low stock" },
  { value: "out", label: "Sold out" },
];

export function ProductTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [query, setQuery] = useState("");
  const [toDelete, setToDelete] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  const category = params.get("category") ?? "";
  const stock = params.get("stock") ?? "";
  const saved = params.get("saved");

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("saved");
    router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        (!category || p.category === category) &&
        (!stock || (stock === "low" ? isLowStock(p) : isSoldOut(p))) &&
        (!q || `${p.name} ${p.slug} ${p.category}`.toLowerCase().includes(q)),
    );
  }, [products, query, category, stock]);

  const savedName = saved ? products.find((p) => p.slug === saved)?.name : null;

  return (
    <>
      {savedName && (
        <div role="status" className="mb-4 flex items-center gap-2 rounded-2xl border border-mint/50 bg-mint/15 px-4 py-3 text-ink">
          <CheckCircle size={20} weight="fill" className="shrink-0 text-mint-deep" />
          <span className="min-w-0 flex-1">
            Saved <strong>{savedName}</strong>. It&apos;s live on the store.
          </span>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => setParam("saved", "")}
            className="press -my-2 -mr-2 grid size-11 place-items-center rounded-full hover:bg-white/60"
          >
            <X size={18} />
          </button>
        </div>
      )}
      {error && (
        <div role="alert" className="mb-4 rounded-2xl border border-danger/40 bg-danger/5 px-4 py-3 text-danger">
          {error}
        </div>
      )}

      <div className="mb-5 grid gap-2 sm:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <MagnifyingGlass size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products"
            aria-label="Search products"
            className={inputClass(false, "pl-11")}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:contents">
          <select aria-label="Category" value={category} onChange={(e) => setParam("category", e.target.value)} className={inputClass(false, "sm:w-44")}>
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <select aria-label="Stock" value={stock} onChange={(e) => setParam("stock", e.target.value)} className={inputClass(false, "sm:w-40")}>
            {STOCK_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="rounded-[1.25rem] border border-dashed border-line bg-white/70 px-5 py-14 text-center">
          <p className="font-display text-xl font-bold text-ink">No products match</p>
          <p className="mt-1 text-slate">Try a different search or clear the filters.</p>
        </div>
      ) : (
        <ul className="grid gap-3">
          <li
            aria-hidden
            className="hidden grid-cols-[minmax(0,1fr)_110px_170px_210px_100px] gap-4 px-4 text-[13px] font-semibold tracking-wide text-slate uppercase lg:grid"
          >
            <span>Product</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Home page</span>
            <span className="text-right">Actions</span>
          </li>
          {results.map((p) => (
            <ProductRow key={p.slug} product={p} onDelete={() => setToDelete(p)} onError={setError} />
          ))}
        </ul>
      )}

      {toDelete && <DeleteDialog product={toDelete} onClose={() => setToDelete(null)} onError={setError} />}
    </>
  );
}

function ProductRow({ product: p, onDelete, onError }: { product: Product; onDelete: () => void; onError: (e: string | null) => void }) {
  const [pending, startTransition] = useTransition();
  const [stock, setStockValue] = useState(String(p.stockQuantity));

  // Keep the field in sync after the server re-renders with fresh data.
  useEffect(() => setStockValue(String(p.stockQuantity)), [p.stockQuantity]);

  function commitStock(next: number) {
    if (!Number.isInteger(next) || next < 0) {
      setStockValue(String(p.stockQuantity));
      return;
    }
    if (next === p.stockQuantity) return;
    setStockValue(String(next));
    startTransition(async () => {
      const result = await setStock(p.slug, next);
      onError(result.error ?? null);
      if (result.error) setStockValue(String(p.stockQuantity));
    });
  }

  function flip(flag: "is_featured" | "is_bestseller", value: boolean) {
    startTransition(async () => {
      const result = await toggleFlag(p.slug, flag, value);
      onError(result.error ?? null);
    });
  }

  const soldOut = isSoldOut(p);
  const low = isLowStock(p);

  return (
    <li
      className={`grid gap-4 rounded-[1.25rem] border border-line bg-white p-3 transition-opacity sm:p-4 lg:grid-cols-[minmax(0,1fr)_110px_170px_210px_100px] lg:items-center ${
        pending ? "opacity-60" : ""
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-ice">
          <Image src={productImageSrc(p, 160)} alt="" fill sizes="64px" className="object-cover" />
        </span>
        <div className="min-w-0">
          <Link href={`/admin/products/${p.slug}`} className="-my-2.5 line-clamp-2 py-2.5 font-semibold text-ink hover:underline">
            {p.name}
          </Link>
          <p className="text-[13px] text-slate">{p.category}</p>
          {(soldOut || low) && (
            <span
              className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[12px] font-bold ${soldOut ? "bg-danger/10 text-danger" : "bg-coral/15 text-coral-deep"}`}
            >
              {soldOut ? "Sold out" : "Low stock"}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2 lg:block">
        <span className="text-[13px] font-semibold text-slate uppercase lg:hidden">Price</span>
        <span className="tabular text-right lg:text-left">
          <span className="block font-semibold text-ink">{cedis(p.price)}</span>
          {p.originalPrice && <span className="block text-[13px] text-slate line-through">{cedis(p.originalPrice)}</span>}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 lg:block">
        <span className="text-[13px] font-semibold text-slate uppercase lg:hidden">Stock</span>
        <div className="flex h-12 items-center rounded-full border border-line bg-mist px-1">
          <button
            type="button"
            aria-label={`Decrease stock of ${p.name}`}
            disabled={pending || Number(stock || 0) <= 0}
            onClick={() => commitStock(Number(stock || 0) - 1)}
            className="press grid size-11 place-items-center rounded-full text-ink hover:bg-white disabled:opacity-35"
          >
            <Minus size={16} weight="bold" />
          </button>
          <input
            inputMode="numeric"
            aria-label={`Stock for ${p.name}`}
            value={stock}
            onChange={(e) => setStockValue(e.target.value.replace(/\D/g, ""))}
            onBlur={() => commitStock(Number(stock || 0))}
            onKeyDown={(e) => e.key === "Enter" && (e.currentTarget as HTMLInputElement).blur()}
            className="tabular h-11 w-14 min-w-0 bg-transparent text-center text-base font-semibold text-ink focus:outline-none"
          />
          <button
            type="button"
            aria-label={`Increase stock of ${p.name}`}
            disabled={pending}
            onClick={() => commitStock(Number(stock || 0) + 1)}
            className="press grid size-11 place-items-center rounded-full text-ink hover:bg-white disabled:opacity-35"
          >
            <Plus size={16} weight="bold" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-line pt-3 lg:contents">
        <div className="flex flex-wrap gap-2">
          <Toggle label="New arrival" on={!!p.isFeatured} disabled={pending} onChange={(v) => flip("is_featured", v)} />
          <Toggle label="Bestseller" on={!!p.isBestseller} disabled={pending} onChange={(v) => flip("is_bestseller", v)} />
        </div>

        <div className="flex shrink-0 justify-end gap-1">
          <Link
            href={`/admin/products/${p.slug}`}
            aria-label={`Edit ${p.name}`}
            className="press grid size-11 place-items-center rounded-full text-brand hover:bg-mist"
          >
            <PencilSimple size={20} />
          </Link>
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete ${p.name}`}
            className="press grid size-11 place-items-center rounded-full text-danger hover:bg-danger/10"
          >
            <Trash size={20} />
          </button>
        </div>
      </div>
    </li>
  );
}

function Toggle({ label, on, disabled, onChange }: { label: string; on: boolean; disabled?: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={() => onChange(!on)}
      className={`press h-11 rounded-full border px-3.5 text-[14px] font-semibold whitespace-nowrap disabled:opacity-60 ${
        on ? "border-brand bg-brand text-white" : "border-line bg-white text-slate hover:border-slate/50"
      }`}
    >
      {label}
    </button>
  );
}

function DeleteDialog({ product, onClose, onError }: { product: Product; onClose: () => void; onError: (e: string | null) => void }) {
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !pending && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, pending]);

  function confirm() {
    startTransition(async () => {
      const result = await deleteProduct(product.slug);
      onError(result.error ?? null);
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-brand/50 sm:items-center sm:p-4">
      <div className="fixed inset-0" onClick={() => !pending && onClose()} />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        aria-describedby="delete-desc"
        className="relative w-full max-w-md rounded-t-[1.75rem] bg-white px-5 pt-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:rounded-[1.75rem] sm:p-6"
      >
        <h2 id="delete-title" className="font-display text-xl font-bold tracking-tight text-ink">
          Delete {product.name}?
        </h2>
        <p id="delete-desc" className="mt-2 text-slate">
          It will disappear from the store straight away and its page will stop working. This can&apos;t be undone.
        </p>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <button type="button" autoFocus onClick={onClose} disabled={pending} className={secondaryButton}>
            Keep it
          </button>
          <button type="button" onClick={confirm} disabled={pending} className={dangerButton}>
            {pending ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
