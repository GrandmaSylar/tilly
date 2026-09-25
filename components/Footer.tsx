import Link from "next/link";
import Image from "next/image";
import { CATEGORIES } from "@/lib/products";

const SHOP_LINKS = [
  { label: "Shop everything", href: "/shop" },
  { label: "Categories", href: "/categories" },
  { label: "New arrivals", href: "/shop?sort=newest" },
  { label: "Bestsellers", href: "/shop?sort=popular" },
  { label: "Deals", href: "/shop?sale=1" },
  { label: "Wishlist", href: "/wishlist" },
];

export function Footer() {
  return (
    <footer className="mt-16 bg-[oklch(16%_0.04_258)] text-white/70">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-6 gap-y-9 min-[400px]:grid-cols-2 px-4 pt-12 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:pt-16 md:gap-12 lg:grid-cols-4">
        <div className="min-[400px]:col-span-2 lg:col-span-1">
          <Image
            src="/logo.png"
            alt="Tilly's Gallery"
            width={624}
            height={414}
            className="h-16 w-auto brightness-0 invert"
          />
          <p className="mt-5 max-w-xs text-base leading-relaxed sm:text-sm">
            Perfumes, bags, clothing, accessories and beauty, delivered across Accra the same day.
          </p>
          <p className="mt-4 text-base leading-relaxed text-white/90 sm:text-sm">
            <a href="tel:+233302008899" className="inline-flex min-h-11 items-center hover:text-mint active:text-mint sm:min-h-0">
              +233 30 200 8899
            </a>
            <br />
            Airport Residential Area, Accra, Ghana
          </p>
        </div>

        <FooterColumn title="Shop" links={SHOP_LINKS} />
        <FooterColumn
          title="Categories"
          links={CATEGORIES.map((c) => ({ label: c.name, href: `/shop?category=${c.name}` }))}
        />

        <div className="min-[400px]:col-span-2 md:col-span-1">
          <p className="font-display text-sm font-bold tracking-wide text-white uppercase">Help</p>
          <ul className="mt-3 space-y-2 text-base sm:text-sm">
            <li>
              <a href="https://wa.me/233302008899" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center font-semibold text-mint hover:text-white active:text-white sm:min-h-9">
                Order on WhatsApp
              </a>
            </li>
            <li>
              <a href="mailto:concierge@tillysgallery.com" className="inline-flex min-h-11 items-center break-all hover:text-white active:text-white sm:min-h-9">
                concierge@tillysgallery.com
              </a>
            </li>
            <li>Same-day delivery in Greater Accra</li>
            <li>48-hour delivery nationwide</li>
            <li>MoMo, Telecel Cash, bank transfer or cash on delivery</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-white/50 sm:px-6">
          © {new Date().getFullYear()} Tilly&apos;s Gallery · Accra, Ghana
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="font-display text-sm font-bold tracking-wide text-white uppercase">{title}</p>
      <ul className="mt-2 text-base sm:text-sm">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="inline-flex min-h-11 min-w-11 items-center transition-colors hover:text-white active:text-white sm:min-h-9">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
