"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { List, X, MagnifyingGlass, Heart, ShoppingCart, WhatsappLogo, ArrowRight } from "@phosphor-icons/react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { WHATSAPP_BUSINESS_NUMBER } from "@/lib/whatsapp";

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/categories" },
  { label: "New Arrivals", href: "/shop?sort=newest" },
  { label: "GH₵1,000 & Below", href: "/shop?price=1000" },
  { label: "Bestsellers", href: "/shop?sort=popular" },
  { label: "Deals", href: "/shop?sale=1", accent: true },
];

export function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { itemCount, openCart } = useCart();
  const { slugs } = useWishlist();

  // Replay the badge bump whenever the count goes up
  const [bumpKey, setBumpKey] = useState(0);
  const lastCount = useRef(itemCount);
  useEffect(() => {
    if (itemCount > lastCount.current) setBumpKey((k) => k + 1);
    lastCount.current = itemCount;
  }, [itemCount]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsMenuOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/shop?search=${encodeURIComponent(q)}` : "/shop");
    setIsMenuOpen(false);
  }

  const searchField = (
    <form role="search" onSubmit={handleSearch} className="relative w-full">
      <MagnifyingGlass size={16} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search perfumes, bags, linen…"
        aria-label="Search products"
        className="h-11 w-full rounded-full border border-line bg-mist pr-4 pl-10 text-base text-ink md:text-sm placeholder:text-slate transition-colors focus:border-mint focus:bg-white focus:outline-none"
      />
    </form>
  );

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-[60px] max-w-7xl items-center gap-6 px-4 sm:h-[70px] sm:px-6">
          <Link href="/" className="press shrink-0" aria-label="Tilly's Gallery home">
            <Image src="/logo.png" alt="Tilly's Gallery" width={624} height={414} priority className="h-11 w-auto sm:h-[54px]" />
          </Link>

          <nav className="hidden items-center gap-5 xl:flex" aria-label="Main">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-[15px] whitespace-nowrap transition-colors ${
                  link.accent ? "font-semibold text-coral hover:text-danger" : "text-slate hover:text-brand"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto hidden w-full max-w-[260px] md:block">{searchField}</div>

          <div className="ml-auto flex items-center gap-0.5 sm:gap-1 md:ml-0">
            <Link
              href="/wishlist"
              aria-label={`Wishlist, ${slugs.length} saved`}
              className="press relative grid size-11 place-items-center rounded-full text-brand hover:bg-mist"
            >
              <Heart size={22} />
              {slugs.length > 0 && <CountBadge value={slugs.length} />}
            </Link>
            <button
              type="button"
              onClick={openCart}
              aria-label={`Open cart, ${itemCount} items`}
              className="press relative grid size-11 place-items-center rounded-full text-brand hover:bg-mist"
            >
              <ShoppingCart size={22} />
              {itemCount > 0 && <CountBadge key={bumpKey} value={itemCount} bump={bumpKey > 0} />}
            </button>
            <a
              href={`https://wa.me/${WHATSAPP_BUSINESS_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="press ml-2 hidden h-11 items-center rounded-full bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-soft sm:inline-flex"
            >
              Concierge
            </a>
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(true)}
              className="press -mr-1.5 grid size-11 place-items-center rounded-full text-brand hover:bg-mist sm:mr-0 xl:hidden"
            >
              <List size={24} />
            </button>
          </div>
        </div>
        <div className="px-4 pb-2.5 md:hidden">{searchField}</div>
      </header>

      {/* Mobile menu */}
      <div
        onClick={() => setIsMenuOpen(false)}
        className={`fixed inset-0 z-50 bg-brand/45 transition-opacity duration-300 xl:hidden ${
          isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        aria-label="Menu"
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
        className={`fixed inset-y-0 right-0 z-50 flex w-[88%] max-w-sm flex-col bg-white shadow-[-24px_0_48px_-24px_oklch(22.51%_0.051_255.57/0.35)] transition-transform duration-[420ms] ease-[var(--ease-drawer)] xl:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-line px-5 sm:h-[70px]">
          <span className="font-display text-lg font-bold tracking-tight text-brand">Menu</span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setIsMenuOpen(false)}
            className="press -mr-2 grid size-11 place-items-center rounded-full text-brand hover:bg-mist"
          >
            <X size={22} />
          </button>
        </div>
        <nav className="flex flex-1 flex-col overflow-y-auto px-3 py-4" aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={`press flex items-center justify-between rounded-2xl px-4 py-3.5 font-display text-xl font-bold tracking-tight hover:bg-mist ${
                link.accent ? "text-coral" : "text-brand"
              }`}
            >
              {link.label}
              <ArrowRight size={18} className="text-slate" />
            </Link>
          ))}
        </nav>
        <div className="border-t border-line px-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <a
            href={`https://wa.me/${WHATSAPP_BUSINESS_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="press flex h-12 items-center justify-center gap-2 rounded-full bg-brand font-semibold text-white"
          >
            <WhatsappLogo size={20} weight="fill" className="text-mint" />
            Chat with our concierge
          </a>
          <p className="mt-3 text-center text-xs text-slate">Airport Residential Area, Accra</p>
        </div>
      </aside>
    </>
  );
}

function CountBadge({ value, bump }: { value: number; bump?: boolean }) {
  return (
    <span
      className={`tabular absolute -top-0.5 -right-0.5 grid min-w-[18px] place-items-center rounded-full bg-mint px-1 text-[10px] leading-[18px] font-bold text-brand ${
        bump ? "bump" : ""
      }`}
    >
      {value}
    </span>
  );
}
