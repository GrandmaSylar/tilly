"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Plus } from "@phosphor-icons/react";
import { productImageSrc, isLowStock, type Product } from "@/lib/products";
import { cedis, discountPercent } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const { addItem, openCart } = useCart();
  const { has, toggle } = useWishlist();
  const image = productImageSrc(product.slug);
  const liked = has(product.slug);
  const off = discountPercent(product.price, product.originalPrice);
  const href = `/shop/${product.slug}`;

  function handleAdd() {
    addItem({
      slug: product.slug,
      name: product.name,
      price: product.price,
      size: product.sizes?.[0] ?? "One Size",
      image,
    });
    openCart();
  }

  return (
    <article className="group relative flex flex-col rounded-[1.25rem] border border-line bg-white p-2 transition-shadow duration-300 sm:p-3 [@media(hover:hover)]:hover:shadow-[0_18px_40px_-22px_oklch(30%_0.03_45/0.35)]">
      <div className="relative aspect-square overflow-hidden rounded-[0.9rem] bg-ice sm:rounded-2xl">
        <Image
          src={image}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1280px) 290px, (min-width: 1024px) 23vw, (min-width: 768px) 31vw, 50vw"
          className="object-cover transition-transform duration-700 ease-[var(--ease-out)] [@media(hover:hover)]:group-hover:scale-[1.04]"
        />
        {off > 0 && <Badge className="top-2 left-2 bg-mint text-ink">{off}% off</Badge>}
        {!off && product.isBestseller && <Badge className="top-2 left-2 bg-gold text-ink">Bestseller</Badge>}
        {isLowStock(product) && (
          <Badge className="bottom-2 left-2 bg-coral text-white">Only {product.stockQuantity} left</Badge>
        )}
        <button
          type="button"
          onClick={() => toggle(product.slug)}
          aria-label={liked ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={liked}
          className="press absolute top-1.5 right-1.5 z-10 grid size-11 place-items-center rounded-full bg-white/90 text-brand backdrop-blur-sm hover:bg-white sm:top-2 sm:right-2"
        >
          <Heart size={20} weight={liked ? "fill" : "regular"} className={liked ? "text-coral" : ""} />
        </button>
      </div>

      <div className="flex flex-1 flex-col px-1 pt-2.5 sm:pt-3">
        <p className="truncate text-[13px] text-slate sm:text-xs">{product.category}</p>
        <h3 className="mt-0.5 line-clamp-2 min-h-[2.5em] text-[15px] leading-[1.25] font-semibold text-ink">
          <Link href={href} className="after:absolute after:inset-0 after:rounded-[1.25rem] after:content-['']">
            {product.name}
          </Link>
        </h3>
        <div className="mt-auto flex items-end justify-between gap-1.5 pt-2 sm:gap-2 sm:pt-3">
          <div className="min-w-0">
            {product.originalPrice && (
              <p className="tabular text-xs leading-tight text-slate/70 line-through">{cedis(product.originalPrice)}</p>
            )}
            <p className="tabular font-display text-[clamp(1.05rem,0.9rem+0.8vw,1.25rem)] leading-tight font-bold tracking-tight text-ink sm:text-xl">
              {cedis(product.price)}
            </p>
            {product.originalPrice && (
              <p className="tabular mt-0.5 text-[11px] font-bold tracking-wide text-ink uppercase">
                Save {cedis(product.originalPrice - product.price)}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="press relative z-10 grid size-11 shrink-0 place-items-center rounded-full bg-brand text-white hover:bg-brand-soft sm:flex sm:h-10 sm:w-auto sm:px-4 sm:text-[13px] sm:font-semibold"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus size={18} weight="bold" className="sm:hidden" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </article>
  );
}

function Badge({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span
      className={`absolute rounded-md px-1.5 py-0.5 text-[11px] leading-tight font-bold tracking-wide whitespace-nowrap uppercase sm:px-2 sm:py-1 ${className}`}
    >
      {children}
    </span>
  );
}
