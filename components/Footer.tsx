import Link from "next/link";

const SHOP_LINKS = [
  { label: "Labadi Fragrances", href: "/shop?category=Perfumes" },
  { label: "Osu Leather Craft", href: "/shop?category=Bags" },
  { label: "Cantonments Apparel", href: "/shop?category=Clothing" },
  { label: "Ridge Gold Accessories", href: "/shop?category=Accessories" },
  { label: "Botanical Beauty", href: "/shop?category=Beauty" },
];

const INFO_LINKS = [
  { label: "Maison Story", href: "/about" },
  { label: "Greater Accra Delivery", href: "/shipping" },
  { label: "Worldwide Express", href: "/shipping" },
  { label: "Private Concierge", href: "/concierge" },
];

export function Footer() {
  return (
    <footer className="border-t border-border-dark bg-cream text-off-black pt-20 pb-12">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 md:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-light text-off-black">Tilly&apos;s Gallery</p>
          <p className="mt-3 text-xs leading-relaxed tracking-wider text-stone uppercase">
            Ghana&apos;s Premier Luxury Maison
          </p>
          <p className="mt-4 text-xs font-light text-stone leading-relaxed">
            Airport Residential Area<br />
            Accra, Greater Accra Region<br />
            Ghana, West Africa
          </p>
        </div>

        <FooterColumn title="Curated Edit" links={SHOP_LINKS} />
        <FooterColumn title="Services" links={INFO_LINKS} />

        <div>
          <p className="text-xs font-medium tracking-widest text-off-black uppercase">Accra Concierge</p>
          <ul className="mt-4 space-y-3">
            <li>
              <a
                href="mailto:concierge@tillysgallery.com"
                className="text-xs tracking-wide text-stone uppercase hover:text-bronze transition-colors"
              >
                concierge@tillysgallery.com
              </a>
            </li>
            <li>
              <a
                href="tel:+233302008899"
                className="text-xs tracking-wide text-stone uppercase hover:text-bronze transition-colors"
              >
                +233 (0) 30 200 8899
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/233302008899"
                target="_blank"
                rel="noreferrer"
                className="text-xs tracking-wide text-stone uppercase hover:text-bronze transition-colors"
              >
                WhatsApp Concierge →
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-7xl border-t border-border-dark px-6 pt-6">
        <div className="flex flex-col items-start justify-between gap-2 text-xs tracking-wide text-stone uppercase md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Tilly&apos;s Gallery Accra. All rights reserved.</p>
          <p>Handcrafted with Intention in Accra, Ghana</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="text-xs font-medium tracking-widest text-off-black uppercase">{title}</p>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-xs tracking-wide text-stone uppercase hover:text-bronze transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

