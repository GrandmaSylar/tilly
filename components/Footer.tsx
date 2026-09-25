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
    <footer className="mt-24 bg-[oklch(16%_0.04_258)] text-white/70">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 pt-16 pb-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image
            src="/logo.png"
            alt="Tilly's Gallery"
            width={624}
            height={414}
            className="h-16 w-auto brightness-0 invert"
          />
          <p className="mt-5 max-w-xs text-sm leading-relaxed">
            Perfumes, bags, clothing, accessories and beauty, delivered across Accra the same day.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/90">
            <a href="tel:+233302008899" className="hover:text-mint">
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

        <div>
          <p className="font-display text-sm font-bold tracking-wide text-white uppercase">Help</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a href="https://wa.me/233302008899" target="_blank" rel="noreferrer" className="font-semibold text-mint hover:text-white">
                Order on WhatsApp
              </a>
            </li>
            <li>
              <a href="mailto:concierge@tillysgallery.com" className="hover:text-white">
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
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="transition-colors hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
