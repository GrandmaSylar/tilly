"use client";

import Link from "next/link";
import Image from "next/image";
import { X, Minus, Plus, ShoppingBag } from "@phosphor-icons/react";
import { useCart } from "@/context/CartContext";

export function CartDrawer() {
  const { items, subtotal, isOpen, closeCart, removeItem, updateQuantity } = useCart();
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border-dark bg-ecru text-off-black shadow-2xl transition-transform duration-[350ms] ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border-light">
          <div className="flex items-baseline gap-3">
            <h2 className="font-display text-2xl font-light text-off-black">Your Shopping Bag</h2>
            <span className="text-xs text-stone font-medium">({totalItemCount} {totalItemCount === 1 ? "item" : "items"})</span>
          </div>
          <button
            type="button"
            aria-label="Close cart"
            onClick={closeCart}
            className="active-tactile p-1 text-off-black transition-colors hover:text-bronze"
          >
            <X size={20} />
          </button>
        </div>

        {/* Greater Accra Express Shipping Callout */}
        <div className="bg-cream px-6 py-2.5 text-center text-xs text-stone border-b border-border-light">
          <span className="text-bronze font-medium">Complimentary Express Shipping</span> across Greater Accra applied.
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center py-16">
              <ShoppingBag size={44} weight="thin" className="text-stone/60" />
              <p className="font-display text-xl text-off-black font-light">Your bag is currently empty</p>
              <p className="text-xs text-stone max-w-xs">Explore our curated collection of fine perfumes, leather craft, and tailored apparel.</p>
              <button
                type="button"
                onClick={closeCart}
                className="active-tactile mt-4 border border-off-black px-6 py-3 text-xs tracking-widest uppercase text-off-black transition-colors hover:bg-off-black hover:text-ecru"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-border-light">
              {items.map((item) => (
                <li key={`${item.slug}-${item.size}`} className="flex gap-4 py-5">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden border border-border-light bg-cream">
                    <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <p className="font-display text-base font-light text-off-black leading-snug">{item.name}</p>
                        <button
                          type="button"
                          aria-label="Remove item"
                          onClick={() => removeItem(item.slug, item.size)}
                          className="text-stone hover:text-off-black transition-colors p-0.5"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      {item.size !== "One Size" && (
                        <p className="mt-1 text-xs text-stone">Size: {item.size}</p>
                      )}
                      <p className="mt-1 text-xs font-semibold text-off-black">
                        GH₵ {item.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3 border border-border-dark px-2 py-1 bg-cream/50">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() =>
                            updateQuantity(item.slug, item.size, item.quantity - 1)
                          }
                          className="active-tactile p-1 text-stone hover:text-off-black"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-medium px-1">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() =>
                            updateQuantity(item.slug, item.size, item.quantity + 1)
                          }
                          className="active-tactile p-1 text-stone hover:text-off-black"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <p className="text-xs font-medium text-stone">
                        Total: GH₵ {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border-dark bg-cream px-6 py-6">
            <div className="flex justify-between text-xs text-stone uppercase tracking-wider mb-1">
              <span>Estimated Shipping</span>
              <span className="text-bronze font-medium">Free (Accra)</span>
            </div>
            <div className="flex justify-between text-base font-light font-display text-off-black py-2">
              <span>Subtotal</span>
              <span className="font-sans font-semibold text-lg">GH₵ {subtotal.toLocaleString()}</span>
            </div>

            <Link
              href="/shop"
              onClick={closeCart}
              className="active-tactile mt-4 block w-full bg-off-black py-4 text-center text-xs font-medium tracking-widest text-ecru uppercase transition-colors hover:bg-stone"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

