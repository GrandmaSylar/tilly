"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "@phosphor-icons/react";
import { productImageSrc, type Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";

export function ProductCard({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();
  const [isLiked, setIsLiked] = useState(false);
  const image = productImageSrc(product.slug);

  function handleQuickAdd() {
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
    <div className="group flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden border border-border-light bg-cream transition-all duration-300 group-hover:border-border-dark group-hover:shadow-xs">
        <Link href={`/shop/${product.slug}`} className="block h-full w-full">
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </Link>

        {/* Wishlist Heart Toggle */}
        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={() => setIsLiked(!isLiked)}
          className={`active-tactile absolute top-3 right-3 rounded-full bg-ecru/80 p-2 text-off-black backdrop-blur-xs transition-all duration-300 ${
            isLiked ? "opacity-100 text-bronze scale-110" : "opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
          }`}
        >
          <Heart size={18} weight={isLiked ? "fill" : "regular"} />
        </button>

        {/* Quick Add Button */}
        <button
          type="button"
          onClick={handleQuickAdd}
          className="active-tactile absolute bottom-0 w-full translate-y-full bg-off-black py-3 text-[11px] font-medium tracking-widest text-ecru uppercase transition-transform duration-300 ease-out group-hover:translate-y-0"
        >
          Quick Add
        </button>
      </div>

      <div className="mt-3 text-left">
        <span className="text-[10px] tracking-widest text-stone uppercase font-medium">
          {product.category}
        </span>
        <Link href={`/shop/${product.slug}`} className="block">
          <h3 className="font-display text-lg font-light text-off-black transition-colors group-hover:text-bronze leading-snug mt-0.5">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-xs font-semibold text-off-black tracking-tight">
          GH₵ {product.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

