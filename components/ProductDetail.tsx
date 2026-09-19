"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Minus, Plus, Truck } from "@phosphor-icons/react";
import { productImageSrc, type Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";

const ACCORDIONS = ["Description", "Details & Care", "Delivery & Returns"] as const;
const THUMBNAIL_FOCAL_POINTS = ["center", "25% 15%", "75% 30%", "50% 85%"] as const;

export function ProductDetail({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();
  const [activeThumbnail, setActiveThumbnail] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] ?? null);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("Description");
  const image = productImageSrc(product.slug);

  function handleAddToBag() {
    addItem({
      slug: product.slug,
      name: product.name,
      price: product.price,
      size: selectedSize ?? "One Size",
      image,
      quantity,
    });
    openCart();
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      {/* Breadcrumb Navigation */}
      <div className="mb-8 flex items-center gap-2 text-xs text-stone">
        <Link href="/" className="hover:text-off-black">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-off-black">Shop</Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category}`} className="hover:text-off-black">{product.category}</Link>
        <span>/</span>
        <span className="text-off-black font-medium">{product.name}</span>
      </div>

      <div className="flex flex-col gap-12 md:flex-row md:gap-16">
        {/* Image gallery */}
        <div className="md:w-[58%]">
          <div className="relative aspect-[3/4] overflow-hidden border border-border-light bg-cream shadow-xs">
            <Image
              src={image}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 768px) 60vw, 100vw"
              className="object-cover transition-all duration-500"
              style={{ objectPosition: THUMBNAIL_FOCAL_POINTS[activeThumbnail] }}
            />
          </div>

          <div className="mt-4 grid grid-cols-4 gap-3">
            {THUMBNAIL_FOCAL_POINTS.map((focalPoint, index) => (
              <button
                key={focalPoint}
                type="button"
                onClick={() => setActiveThumbnail(index)}
                className={`active-tactile relative aspect-square overflow-hidden border bg-cream transition-colors ${
                  activeThumbnail === index ? "border-off-black ring-1 ring-off-black" : "border-border-light hover:border-stone"
                }`}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-cover"
                  style={{ objectPosition: focalPoint }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product info */}
        <div className="md:sticky md:top-28 md:h-fit md:w-[42%]">
          <span className="mb-2 inline-block text-xs font-medium tracking-widest text-stone uppercase">
            {product.category}
          </span>
          <h1 className="font-display text-3xl font-light text-off-black leading-tight md:text-4xl">
            {product.name}
          </h1>
          <p className="mt-3 font-sans text-xl font-semibold text-off-black tracking-tight">
            GH₵ {product.price.toLocaleString()}
          </p>

          <div className="my-6 border-t border-border-dark" />

          <p className="text-sm leading-relaxed text-stone">
            {product.description}
          </p>

          {/* Greater Accra Express Badge */}
          <div className="mt-6 flex items-center gap-3 rounded-none border border-border-dark bg-cream p-3 text-xs text-stone">
            <Truck size={20} className="text-bronze shrink-0" />
            <div>
              <span className="font-semibold text-off-black">Accra Express Available</span>
              <p className="text-[11px]">Order before 2 PM for same-day delivery across Cantonments, Osu, East Legon & Airport Hills.</p>
            </div>
          </div>

          {product.sizes && (
            <div className="mt-8">
              <div className="flex justify-between items-baseline mb-3">
                <p className="text-xs font-medium tracking-widest text-off-black uppercase">Select Size</p>
                <span className="text-[11px] text-stone underline">Size Guide</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`active-tactile h-11 w-11 text-xs font-medium transition-colors ${
                      selectedSize === size
                        ? "bg-off-black text-ecru"
                        : "border border-border-dark text-off-black hover:border-off-black bg-cream/40"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <p className="mb-3 text-xs font-medium tracking-widest text-off-black uppercase">Quantity</p>
            <div className="flex items-center gap-4 text-off-black">
              <div className="flex items-center border border-border-dark bg-cream px-3 py-2">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  className="active-tactile p-1 text-stone hover:text-off-black"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((value) => value + 1)}
                  className="active-tactile p-1 text-stone hover:text-off-black"
                >
                  <Plus size={14} />
                </button>
              </div>
              {product.stockQuantity && (
                <span className="text-xs text-stone">
                  {product.stockQuantity < 10 ? `Only ${product.stockQuantity} left in stock` : "In Stock — Ready to ship"}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToBag}
            className="active-tactile mt-8 w-full bg-off-black py-4 text-xs font-medium tracking-widest text-ecru uppercase transition-colors hover:bg-stone"
          >
            Add to Bag — GH₵ {(product.price * quantity).toLocaleString()}
          </button>

          <button
            type="button"
            onClick={() => setIsLiked(!isLiked)}
            className="active-tactile mt-4 flex items-center justify-center gap-2 w-full border border-border-dark py-3 text-xs tracking-widest text-off-black uppercase transition-colors hover:bg-cream"
          >
            <Heart size={16} weight={isLiked ? "fill" : "regular"} className={isLiked ? "text-bronze" : ""} />
            {isLiked ? "Saved in Wishlist" : "Add to Wishlist"}
          </button>

          <div className="mt-8 border-t border-border-dark" />

          {/* Accordion sections */}
          <div className="mt-2 flex flex-col divide-y divide-border-dark">
            {ACCORDIONS.map((section) => {
              const isOpen = openAccordion === section;
              return (
                <div key={section} className="py-4">
                  <button
                    type="button"
                    onClick={() => setOpenAccordion(isOpen ? null : section)}
                    className="flex w-full items-center justify-between text-xs tracking-widest text-off-black uppercase font-medium"
                  >
                    {section}
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </button>

                  {isOpen && (
                    <p className="mt-3 text-xs leading-relaxed text-stone transition-opacity duration-300 ease-out">
                      {section === "Description" && product.description}
                      {section === "Details & Care" && product.details}
                      {section === "Delivery & Returns" && product.delivery}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

