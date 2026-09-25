"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Minus, Plus, Truck, ShieldCheck, WhatsappLogo, Check } from "@phosphor-icons/react";
import { productImageSrc, isLowStock, type Product } from "@/lib/products";
import { cedis, discountPercent } from "@/lib/format";
import { WHATSAPP_BUSINESS_NUMBER } from "@/lib/whatsapp";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const FOCAL_POINTS = ["center", "25% 15%", "75% 30%", "50% 85%"] as const;

export function ProductDetail({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();
  const { has, toggle } = useWishlist();
  const [focal, setFocal] = useState(0);
  const [size, setSize] = useState(product.sizes?.[0] ?? null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const image = productImageSrc(product.slug);
  const liked = has(product.slug);
  const off = discountPercent(product.price, product.originalPrice);
  const low = isLowStock(product);
  const maxQty = product.stockQuantity ?? 99;

  function handleAdd() {
    addItem({ slug: product.slug, name: product.name, price: product.price, size: size ?? "One Size", image, quantity });
    setAdded(true);
    openCart();
    window.setTimeout(() => setAdded(false), 2000);
  }

  const askText = `Hi Tilly's Gallery, I'd like to ask about the ${product.name}${size ? ` (size ${size})` : ""}.`;

  return (
    <main className="mx-auto max-w-7xl px-4 pt-3 sm:px-6 sm:pt-6">
      <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2 text-[15px] text-slate sm:text-sm">
        <Link href="/shop" className="inline-flex min-h-11 min-w-11 shrink-0 items-center hover:text-brand">
          Shop
        </Link>
        <span aria-hidden>/</span>
        <Link href={`/shop?category=${product.category}`} className="inline-flex min-h-11 shrink-0 items-center hover:text-brand">
          {product.category}
        </Link>
        <span aria-hidden>/</span>
        <span className="truncate text-ink" aria-current="page">
          {product.name}
        </span>
      </nav>

      <div className="mt-3 grid gap-6 sm:mt-5 sm:gap-8 lg:grid-cols-2 lg:gap-10">
        <div>
          <div className="relative -mx-4 aspect-square overflow-hidden bg-ice sm:mx-0 sm:rounded-[1.75rem]">
            <Image
              src={image}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 1024px) 620px, 100vw"
              className="object-cover transition-[object-position] duration-500 ease-[var(--ease-out)]"
              style={{ objectPosition: FOCAL_POINTS[focal] }}
            />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">
            {FOCAL_POINTS.map((point, i) => (
              <button
                key={point}
                type="button"
                onClick={() => setFocal(i)}
                aria-label={`View detail ${i + 1}`}
                aria-pressed={focal === i}
                className={`press relative aspect-square overflow-hidden rounded-xl bg-ice ring-offset-2 sm:rounded-2xl ${
                  focal === i ? "ring-2 ring-brand" : "opacity-80 hover:opacity-100"
                }`}
              >
                <Image src={image} alt="" fill sizes="140px" className="object-cover" style={{ objectPosition: point }} />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          {off > 0 && (
            <p className="inline-flex rounded-full bg-coral/15 px-3 py-1 text-[13px] font-semibold text-coral-deep">
              {off}% off · save {cedis((product.originalPrice ?? 0) - product.price)}
            </p>
          )}
          <h1 className="mt-3 font-display text-[clamp(1.6rem,1.1rem+2.4vw,2.25rem)] leading-tight font-bold tracking-tight text-balance text-ink">
            {product.name}
          </h1>
          <p className="mt-2 text-base text-slate">{product.details}</p>

          <p className="tabular mt-4 flex flex-wrap items-baseline gap-x-3 sm:mt-5">
            {product.originalPrice && <span className="text-lg text-slate/70 line-through sm:text-xl">{cedis(product.originalPrice)}</span>}
            <span className="font-display text-[clamp(1.85rem,1.4rem+2vw,2.25rem)] leading-tight font-bold tracking-tight text-ink">{cedis(product.price)}</span>
          </p>
          <p className={`mt-2 text-[15px] font-semibold sm:text-sm ${low ? "text-coral-deep" : "text-mint-deep"}`}>
            {low ? `Only ${product.stockQuantity} left` : "In stock, ready to dispatch"}
          </p>

          {product.sizes && (
            <fieldset className="mt-6">
              <legend className="text-[15px] font-semibold text-ink sm:text-sm">
                Size <span className="font-normal text-slate">· {size}</span>
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    aria-pressed={size === s}
                    className={`press h-11 min-w-12 rounded-full border px-4 text-[15px] font-semibold sm:text-sm ${
                      size === s ? "border-brand bg-brand text-white" : "border-line bg-white text-ink hover:border-slate/50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="order-1 flex h-[52px] items-center rounded-full border border-line bg-white px-1.5">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="press grid size-11 place-items-center rounded-full text-ink hover:bg-mist disabled:opacity-35"
              >
                <Minus size={16} weight="bold" />
              </button>
              <span className="tabular w-9 text-center font-semibold" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                disabled={quantity >= maxQty}
                onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                className="press grid size-11 place-items-center rounded-full text-ink hover:bg-mist disabled:opacity-35"
              >
                <Plus size={16} weight="bold" />
              </button>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              className="press order-3 flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-brand font-semibold whitespace-nowrap text-white hover:bg-brand-soft sm:order-2 sm:w-auto sm:flex-1"
            >
              {added ? (
                <>
                  <Check size={18} weight="bold" className="text-sand" /> Added
                </>
              ) : (
                <>Add to cart · {cedis(product.price * quantity)}</>
              )}
            </button>
            <button
              type="button"
              onClick={() => toggle(product.slug)}
              aria-label={liked ? "Remove from wishlist" : "Save to wishlist"}
              aria-pressed={liked}
              className="press order-2 ml-auto grid size-[52px] shrink-0 place-items-center rounded-full border border-line bg-white text-brand hover:border-slate/50 sm:order-3 sm:ml-0"
            >
              <Heart size={22} weight={liked ? "fill" : "regular"} className={liked ? "text-coral" : ""} />
            </button>
          </div>

          <a
            href={`https://wa.me/${WHATSAPP_BUSINESS_NUMBER}?text=${encodeURIComponent(askText)}`}
            target="_blank"
            rel="noreferrer"
            className="press mt-3 flex h-[52px] items-center justify-center gap-2 rounded-full border border-mint bg-mint/10 font-semibold text-brand hover:bg-mint/20"
          >
            <WhatsappLogo size={20} weight="fill" className="text-mint-deep" />
            Ask about this on WhatsApp
          </a>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <InfoCard icon={<Truck size={18} weight="bold" />}>{product.delivery}</InfoCard>
            <InfoCard icon={<ShieldCheck size={18} weight="bold" />}>
              Pay on WhatsApp with MoMo, Telecel Cash, bank transfer or cash on delivery.
            </InfoCard>
          </div>

          <div className="mt-5 rounded-[1.25rem] border border-line bg-white p-5">
            <h2 className="font-display text-lg font-bold tracking-tight text-ink">Details</h2>
            <p className="mt-2 leading-relaxed text-slate">{product.description}</p>
          </div>
        </div>
      </div>
    </main>
  );
}

function InfoCard({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-[1.25rem] border border-line bg-white p-4 text-base leading-snug text-slate sm:text-sm">
      <span className="mt-0.5 shrink-0 text-mint-deep">{icon}</span>
      <p>{children}</p>
    </div>
  );
}
