"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "@phosphor-icons/react";
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
    <article className="group relative flex flex-col rounded-[1.25rem] border border-line bg-white p-3 transition-shadow duration-300 [@media(hover:hover)]:hover:shadow-[0_18px_40px_-22px_oklch(22.51%_0.051_255.57/0.35)]">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-ice">
        <Image
          src={image}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1280px) 290px, (min-width: 768px) 30vw, 50vw"
          className="object-cover transition-transform duration-700 ease-[var(--ease-out)] [@media(hover:hover)]:group-hover:scale-[1.04]"
        />
        {off > 0 && (
          <span className="absolute top-2.5 left-2.5 rounded-md bg-mint px-2 py-1 text-[10px] font-bold tracking-wide text-brand uppercase">
            {off}% off
          </span>
        )}
        {!off && product.isBestseller && (
          <span className="absolute top-2.5 left-2.5 rounded-md bg-gold px-2 py-1 text-[10px] font-bold tracking-wide text-brand uppercase">
            Bestseller
          </span>
        )}
        {isLowStock(product) && (
          <span className="absolute bottom-2.5 left-2.5 rounded-md bg-coral px-2 py-1 text-[10px] font-bold tracking-wide text-white uppercase">
            Only {product.stockQuantity} left
          </span>
        )}
        <button
          type="button"
          onClick={() => toggle(product.slug)}
          aria-label={liked ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={liked}
          className="press absolute top-2 right-2 z-10 grid size-8 place-items-center rounded-full bg-white/85 text-brand backdrop-blur-sm hover:bg-white"
        >
          <Heart size={17} weight={liked ? "fill" : "regular"} className={liked ? "text-coral" : ""} />
        </button>
      </div>

      <div className="flex flex-1 flex-col px-1 pt-3">
        <p className="text-xs text-slate">{product.category}</p>
        <h3 className="mt-0.5 text-[15px] leading-snug font-semibold text-ink">
          <Link href={href} className="after:absolute after:inset-0 after:rounded-[1.25rem] after:content-['']">
            {product.name}
          </Link>
        </h3>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div>
            {product.originalPrice && (
              <p className="tabular text-xs text-slate/70 line-through">{cedis(product.originalPrice)}</p>
            )}
            <p className="tabular font-display text-xl leading-tight font-bold tracking-tight text-ink">
              {cedis(product.price)}
            </p>
            {product.originalPrice && (
              <p className="tabular mt-0.5 text-[10px] font-bold tracking-wide text-ink uppercase">
                Save {cedis(product.originalPrice - product.price)}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="press relative z-10 shrink-0 rounded-full bg-brand px-3.5 py-1.5 text-[12px] font-semibold text-white hover:bg-brand-soft"
            aria-label={`Add ${product.name} to cart`}
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
