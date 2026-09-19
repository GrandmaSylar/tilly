"use client";

import Link from "next/link";
import Image from "next/image";
import { products, categoryImageSrc } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

const CATEGORIES = ["Perfumes", "Bags", "Clothing", "Accessories"] as const;

const TICKER_ITEMS = [
  "LABADI FRAGRANCES",
  "OSU LEATHER CRAFT",
  "CANTONMENTS TAILORING",
  "RIDGE GOLD JEWELLERY",
  "AKROPONG BOTANICALS",
  "EXPRESS ACCRA DELIVERY",
];

export default function Home() {
  const newArrivals = products.filter((p) => p.isFeatured).slice(0, 4);
  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 4);

  return (
    <main className="bg-ecru text-off-black">
      {/* Hero Section */}
      <section className="relative flex min-h-[85vh] flex-col justify-end overflow-hidden bg-cream border-b border-border-dark py-12 md:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 py-12">
          <span className="mb-4 inline-block text-xs font-semibold tracking-widest text-bronze uppercase">
            Accra Flagship • Autumn 2026 Collection
          </span>

          <h1 className="font-display text-[clamp(48px,8vw,110px)] leading-[0.98] font-light tracking-tight text-off-black animate-fade-in">
            The Accra Edit.
            <br />
            <span className="text-stone font-extralight">Understated Luxury.</span>
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-relaxed text-stone">
            A carefully considered collection of fine botanical fragrances, architectural leather goods, and fluid tailored silhouettes—crafted for West African elegance and international ease.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link
              href="/shop"
              className="active-tactile border border-off-black bg-off-black px-8 py-3.5 text-xs font-medium tracking-widest text-ecru uppercase transition-colors hover:bg-stone hover:border-stone"
            >
              Explore Collection
            </Link>
            <Link
              href="/shop?category=Perfumes"
              className="active-tactile text-xs font-medium tracking-widest text-off-black uppercase hover:text-bronze underline-offset-8 hover:underline"
            >
              The Labadi Fragrance →
            </Link>
          </div>
        </div>

        {/* Marquee Ticker */}
        <div className="relative overflow-hidden border-t border-border-dark bg-ecru/60 py-4">
          <div className="flex w-max animate-ticker gap-16 whitespace-nowrap">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="text-[11px] font-medium tracking-widest text-stone uppercase"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-32">
        <div className="flex items-baseline justify-between mb-12 border-b border-border-light pb-4">
          <div>
            <span className="text-xs font-medium tracking-widest text-bronze uppercase">Curated Departments</span>
            <h2 className="font-display text-3xl font-light text-off-black mt-1">Shop by Category</h2>
          </div>
          <Link href="/shop" className="text-xs tracking-widest text-stone uppercase hover:text-off-black">
            View All Categories →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {CATEGORIES.map((category) => (
            <Link
              key={category}
              href={`/shop?category=${category}`}
              className="group relative aspect-[2/3] overflow-hidden border border-border-light bg-cream transition-all duration-500 hover:border-off-black hover:shadow-md active-tactile"
            >
              <Image
                src={categoryImageSrc(category)}
                alt={category}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] uppercase tracking-widest text-ecru/70 font-medium">Department</span>
                <h3 className="font-display text-2xl font-light text-ecru mt-0.5">
                  {category}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24 border-t border-border-light">
        <div className="flex items-baseline justify-between mb-12">
          <div>
            <span className="text-xs font-medium tracking-widest text-bronze uppercase">Latest Additions</span>
            <h2 className="font-display text-3xl font-light text-off-black md:text-5xl mt-1">
              New Arrivals
            </h2>
          </div>
          <Link href="/shop" className="text-xs tracking-widest text-stone uppercase hover:text-off-black">
            Browse All ({products.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4 md:gap-x-6 md:gap-y-12">
          {newArrivals.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      {/* Brand Mission Statement (Editorial Dark Contrast Section) */}
      <section className="bg-off-black py-28 text-ecru md:py-36">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="text-xs font-medium tracking-widest text-stone uppercase">Our Maison Commitment</span>
          <h2 className="mt-6 font-display text-[clamp(28px,4.5vw,52px)] font-light leading-snug tracking-wide text-ecru">
            &ldquo;We source deliberately. We edit ruthlessly. We deliver nothing less to Accra and beyond.&rdquo;
          </h2>
          <p className="mt-6 text-xs tracking-widest text-stone uppercase font-light">
            Airport Residential Area • Accra, Ghana
          </p>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-32">
        <div className="flex items-baseline justify-between mb-12">
          <div>
            <span className="text-xs font-medium tracking-widest text-bronze uppercase">Most Coveted</span>
            <h2 className="font-display text-3xl font-light text-off-black md:text-5xl mt-1">
              The Bestsellers
            </h2>
          </div>
          <Link href="/shop" className="text-xs tracking-widest text-stone uppercase hover:text-off-black">
            Explore Collection →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4 md:gap-x-6 md:gap-y-12">
          {bestsellers.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      {/* Lookbook Feature */}
      <section className="grid grid-cols-1 border-y border-border-dark bg-cream md:grid-cols-2">
        <div className="relative aspect-[4/3] bg-cream md:aspect-auto md:min-h-[550px]">
          <Image
            src="/images/category-perfumes.jpg"
            alt="The Labadi Fragrance Edit"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center px-8 py-20 md:px-16">
          <span className="text-xs font-medium tracking-widest text-bronze uppercase">Editorial Feature</span>
          <h2 className="mt-3 font-display text-4xl font-light text-off-black md:text-5xl">
            The Labadi Fragrance Accord
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-stone">
            Two signature accords built around smoked amber, coastal vetiver, and raw Ghanaian cedarwood. Crafted to linger close to the skin through warm West African afternoons and evening galas.
          </p>
          <div className="mt-8">
            <Link
              href="/shop/ambre-noir-eau-de-parfum"
              className="active-tactile inline-block border border-off-black bg-off-black px-8 py-3.5 text-xs font-medium tracking-widest text-ecru uppercase transition-colors hover:bg-stone hover:border-stone"
            >
              Discover Labadi Coast Parfum
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-ecru px-6 py-24 text-center md:py-32">
        <div className="mx-auto max-w-xl">
          <span className="text-xs font-medium tracking-widest text-bronze uppercase">Private Access</span>
          <h2 className="mt-3 font-display text-3xl font-light text-off-black md:text-4xl">
            Stay in the Edit.
          </h2>
          <p className="mt-3 text-sm text-stone">
            Receive private invitations to new Accra collection launches, trunk shows, and bespoke orders.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you for subscribing to Tilly's Gallery Private Edit.");
            }}
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="flex-1 border border-border-dark bg-cream px-4 py-3.5 text-xs text-off-black placeholder:text-stone focus:border-off-black focus:outline-none"
            />
            <button
              type="submit"
              className="active-tactile bg-off-black px-8 py-3.5 text-xs font-medium tracking-widest text-ecru uppercase transition-colors hover:bg-stone"
            >
              Subscribe
            </button>
          </form>

          <p className="mt-4 text-[11px] text-stone">Complimentary unsubscription anytime. We respect your privacy.</p>
        </div>
      </section>
    </main>
  );
}

