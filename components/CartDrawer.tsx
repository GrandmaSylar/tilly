"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, ShoppingCart, WhatsappLogo, Trash } from "@phosphor-icons/react";
import { useCart } from "@/context/CartContext";
import { cedis } from "@/lib/format";
import { WhatsAppCheckoutModal } from "@/components/WhatsAppCheckoutModal";

export function CartDrawer() {
  const { items, itemCount, subtotal, isOpen, closeCart, removeItem, updateQuantity } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  return (
    <>
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-50 bg-brand/45 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Cart"
        inert={!isOpen}
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-[-24px_0_48px_-24px_oklch(30%_0.03_45/0.35)] transition-transform duration-[420ms] ease-[var(--ease-drawer)] sm:inset-y-3 sm:right-3 sm:rounded-[1.75rem] ${
          isOpen ? "translate-x-0" : "translate-x-[calc(100%+1rem)]"
        }`}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <h2 className="font-display text-xl font-bold tracking-tight text-ink">
            Your cart <span className="tabular font-sans text-base font-normal text-slate">({itemCount})</span>
          </h2>
          <button
            type="button"
            aria-label="Close cart"
            onClick={closeCart}
            className="press -mr-2 grid size-11 place-items-center rounded-full text-brand hover:bg-mist"
          >
            <X size={20} />
          </button>
        </div>

        <p className="mx-5 rounded-xl bg-mint/25 px-4 py-2.5 text-[15px] text-ink sm:text-sm">
          <span className="font-semibold">Free same-day delivery</span> across Greater Accra.
        </p>

        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <span className="grid size-16 place-items-center rounded-full bg-ice text-brand">
                <ShoppingCart size={28} />
              </span>
              <p className="mt-5 font-display text-xl font-bold tracking-tight text-ink">Your cart is empty</p>
              <p className="mt-1.5 max-w-xs text-base text-slate">Add a perfume, a bag or something in silk and it will wait here.</p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="press mt-6 inline-flex h-11 items-center rounded-full bg-brand px-6 font-semibold text-white hover:bg-brand-soft"
              >
                Start shopping
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {items.map((item) => (
                <li key={`${item.slug}-${item.size}`} className="flex gap-3.5 py-4">
                  <Link
                    href={`/shop/${item.slug}`}
                    onClick={closeCart}
                    className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-ice"
                  >
                    <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-ink">{item.name}</p>
                        {item.size !== "One Size" && <p className="text-xs text-slate">Size {item.size}</p>}
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${item.name}`}
                        onClick={() => removeItem(item.slug, item.size)}
                        className="press -mt-2 -mr-2 grid size-11 shrink-0 place-items-center rounded-full text-slate hover:bg-mist hover:text-danger"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-full border border-line">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          disabled={item.quantity <= 1}
                          onClick={() => updateQuantity(item.slug, item.size, item.quantity - 1)}
                          className="press grid size-11 place-items-center rounded-full text-ink hover:bg-mist disabled:opacity-35"
                        >
                          <Minus size={13} weight="bold" />
                        </button>
                        <span className="tabular w-7 text-center text-base font-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => updateQuantity(item.slug, item.size, item.quantity + 1)}
                          className="press grid size-11 place-items-center rounded-full text-ink hover:bg-mist"
                        >
                          <Plus size={13} weight="bold" />
                        </button>
                      </div>
                      <p className="tabular font-display font-bold text-ink">{cedis(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-line px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <div className="flex justify-between text-[15px] text-slate sm:text-sm">
              <span>Delivery (Greater Accra)</span>
              <span className="font-semibold text-mint-deep">Free</span>
            </div>
            <div className="mt-1.5 flex items-baseline justify-between">
              <span className="font-semibold text-ink">Subtotal</span>
              <span className="tabular font-display text-2xl font-bold tracking-tight text-ink">{cedis(subtotal)}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                closeCart();
                setIsCheckoutOpen(true);
              }}
              className="press mt-4 flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-mint font-semibold text-ink hover:brightness-105"
            >
              <WhatsappLogo size={20} weight="fill" />
              Check out on WhatsApp
            </button>
            <p className="mt-2.5 text-center text-xs text-slate">Pay with MoMo, Telecel Cash, bank transfer or on delivery.</p>
          </div>
        )}
      </aside>

      <WhatsAppCheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </>
  );
}
