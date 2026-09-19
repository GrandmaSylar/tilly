"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { List, X, MagnifyingGlass, Heart, Bag } from "@phosphor-icons/react";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { label: "Collection", href: "/shop" },
  { label: "Perfumes", href: "/shop?category=Perfumes" },
  { label: "Bags", href: "/shop?category=Bags" },
  { label: "Clothing", href: "/shop?category=Clothing" },
  { label: "Accessories", href: "/shop?category=Accessories" },
  { label: "Beauty", href: "/shop?category=Beauty" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { itemCount, openCart } = useCart();

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 40);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-30 w-full transition-all duration-300 ${
          isScrolled
            ? "border-b border-border-dark bg-ecru/95 backdrop-blur-md py-3 shadow-xs"
            : "bg-ecru/80 backdrop-blur-sm py-4 border-b border-border-light"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <Link href="/" className="block active-tactile transition-opacity hover:opacity-85">
            <Image
              src="/logo.png"
              alt="Tilly's Gallery — Accra"
              width={624}
              height={414}
              priority
              className="h-12 w-auto object-contain"
            />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs tracking-widest text-off-black uppercase font-medium transition-colors hover:text-bronze underline-offset-8 hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5 text-off-black">
            <button
              type="button"
              aria-label="Search"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="active-tactile p-1 transition-colors hover:text-bronze"
            >
              <MagnifyingGlass size={20} />
            </button>
            <Link
              href="/shop"
              aria-label="Wishlist"
              className="active-tactile p-1 transition-colors hover:text-bronze hidden sm:block"
            >
              <Heart size={20} />
            </Link>
            <button
              type="button"
              aria-label="Open cart"
              onClick={openCart}
              className="active-tactile relative p-1 transition-colors hover:text-bronze"
            >
              <Bag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-off-black text-[10px] font-semibold text-ecru">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setIsMenuOpen(true)}
              className="active-tactile md:hidden p-1 text-off-black"
            >
              <List size={24} />
            </button>
          </div>
        </div>

        {/* Quick Search Drawer */}
        {isSearchOpen && (
          <div className="border-t border-border-dark bg-cream px-6 py-4 transition-all duration-300">
            <div className="mx-auto flex max-w-2xl items-center gap-3">
              <MagnifyingGlass size={18} className="text-stone" />
              <input
                type="text"
                placeholder="Search Labadi perfume, Osu totes, linen trousers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-off-black placeholder:text-stone focus:outline-none"
                autoFocus
              />
              {searchQuery && (
                <Link
                  href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                  onClick={() => setIsSearchOpen(false)}
                  className="text-xs uppercase tracking-widest text-bronze font-medium"
                >
                  Search
                </Link>
              )}
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="text-stone hover:text-off-black"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Fullscreen Menu Drawer */}
      <div
        className={`fixed inset-0 z-50 flex flex-col bg-ecru transition-transform duration-300 ease-out md:hidden ${
          isMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border-dark px-6 py-4">
          <span className="font-display text-lg tracking-wide text-off-black">Tilly&apos;s Maison</span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setIsMenuOpen(false)}
            className="active-tactile p-2 text-off-black"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-12">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="font-display text-3xl font-light text-off-black transition-colors hover:text-bronze"
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-8 flex flex-col items-center gap-3 text-center">
            <span className="text-xs tracking-widest text-stone uppercase">Ghana Flagship</span>
            <p className="text-sm font-light text-off-black">Airport Residential Area, Accra</p>
          </div>
        </nav>
      </div>
    </>
  );
}

