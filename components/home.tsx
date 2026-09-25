import Link from "next/link";
import Image from "next/image";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { CATEGORIES, PRICE_TIERS, productImageSrc, type Product } from "@/lib/products";
import { cedis, discountPercent } from "@/lib/format";
import { Container, SectionHeader } from "@/components/Section";

/* ─── Hero ──────────────────────────────────────────────────────────────── */

export function Hero({ lead, second, from }: { lead: Product; second: Product; from: number }) {
  const off = discountPercent(lead.price, lead.originalPrice);

  return (
    <section className="relative overflow-hidden">
      <Container className="grid items-center gap-10 pt-10 pb-14 sm:pt-16 lg:grid-cols-[1.1fr_1fr] lg:pt-20 lg:pb-20">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-semibold text-brand uppercase shadow-[0_2px_8px_-4px_oklch(22.51%_0.051_255.57/0.2)]">
            <span className="size-2 rounded-full bg-mint" />
            Order by 2 PM, wear it tonight
          </p>
          <h1 className="mt-6 font-display text-[2.15rem] leading-[1.02] font-bold tracking-[-0.025em] text-ink uppercase sm:text-[3.4rem] xl:text-[3.75rem]">
            Perfume, leather
            <br />
            &amp; silk in Accra,
            <br />
            <span className="text-mint">by tonight.</span>
          </h1>
          <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-slate sm:text-lg">
            Extraits de parfum, full-grain leather, linen and silk, chosen in Accra and delivered to your door the same day.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="press inline-flex h-[52px] items-center rounded-full bg-brand px-7 font-semibold text-white uppercase hover:bg-brand-soft"
            >
              Shop now
            </Link>
            <Link
              href="/shop?sort=newest"
              className="press inline-flex h-[52px] items-center rounded-full border border-line bg-white px-7 font-semibold text-brand uppercase hover:border-brand"
            >
              See what&apos;s new
            </Link>
          </div>
          <p className="mt-5 flex items-center gap-2 text-sm text-slate">
            <Check size={14} weight="bold" className="text-mint-deep" />
            Same-day in Cantonments, Osu, East Legon &amp; Airport Hills. 48 hours nationwide.
          </p>
        </div>

        {/* Floating product cards */}
        <div className="relative mx-auto h-[360px] w-full max-w-[560px] sm:h-[440px]" aria-hidden>
          <div className="absolute inset-[10%] rounded-full bg-mint/25 blur-3xl" />

          <HeroCard product={lead} className="top-[3%] left-[3%] w-[45%] [--r:-5deg]" delay={80}>
            <div className="flex items-start justify-between gap-2">
              <p className="text-[13px] leading-tight font-semibold text-ink">{lead.name}</p>
              {off > 0 && (
                <span className="shrink-0 rounded bg-mint px-1.5 py-0.5 text-[9px] font-bold text-brand uppercase">{off}% off</span>
              )}
            </div>
            <p className="mt-1 flex items-baseline gap-2">
              {lead.originalPrice && <span className="text-[11px] text-slate line-through">{cedis(lead.originalPrice)}</span>}
              <span className="font-display text-lg font-bold text-ink">{cedis(lead.price)}</span>
            </p>
          </HeroCard>

          <HeroCard product={second} className="right-[2%] bottom-[2%] w-[42%] [--r:4deg]" delay={200}>
            <div className="flex items-start justify-between gap-2">
              <p className="text-[13px] leading-tight font-semibold text-ink">{second.name}</p>
              <span className="shrink-0 rounded bg-gold px-1.5 py-0.5 text-[9px] font-bold text-brand uppercase">New</span>
            </div>
            <p className="mt-1 font-display text-lg font-bold text-ink">{cedis(second.price)}</p>
          </HeroCard>

          <div
            className="hero-card absolute top-[4%] right-[10%] grid size-[24%] min-w-24 place-items-center rounded-full bg-brand text-center shadow-[0_20px_40px_-12px_oklch(22.51%_0.051_255.57/0.55)] [transform:rotate(var(--r))] [--r:0deg]"
            style={{ animationDelay: "320ms" }}
          >
            <div>
              <p className="text-[9px] font-bold tracking-[0.18em] text-mint uppercase">From</p>
              <p className="font-display text-xl leading-none font-bold text-white sm:text-2xl">{cedis(from)}</p>
            </div>
          </div>

          <div
            className="hero-card absolute bottom-[5%] left-[10%] w-[34%] rounded-2xl bg-coral p-3.5 text-white shadow-[0_18px_36px_-14px_oklch(70.57%_0.1877_32.86/0.7)] [transform:rotate(var(--r))] [--r:-3deg] sm:p-4"
            style={{ animationDelay: "440ms" }}
          >
            <p className="text-[9px] font-bold tracking-wide uppercase opacity-90">Greater Accra</p>
            <p className="mt-1 font-display text-base leading-tight font-bold uppercase sm:text-lg">Same-day delivery.</p>
          </div>
        </div>
      </Container>
    </section>
  );
}

function HeroCard({
  product,
  className,
  delay,
  children,
}: {
  product: Product;
  className: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`hero-card absolute rounded-[1.25rem] bg-white p-2.5 shadow-[0_24px_48px_-20px_oklch(22.51%_0.051_255.57/0.4)] [transform:rotate(var(--r))] ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative aspect-[4/3.4] overflow-hidden rounded-xl bg-ice">
        <Image src={productImageSrc(product.slug)} alt="" fill priority sizes="260px" className="object-cover" />
      </div>
      <div className="px-1 pt-2.5 pb-1">{children}</div>
    </div>
  );
}

/* ─── Ticker ────────────────────────────────────────────────────────────── */

const TICKER = ["Same-day in Accra", "Extraits de parfum", "Full-grain leather", "Linen & silk", "18k gold vermeil", "Pay with MoMo"];

export function Ticker() {
  const items = [...TICKER, ...TICKER];
  return (
    <div className="overflow-hidden bg-brand py-3.5 text-white" aria-hidden>
      <div className="animate-ticker flex w-max">
        {items.map((item, i) => (
          <span key={i} className="flex items-center font-display text-sm font-bold tracking-[0.06em] whitespace-nowrap uppercase">
            <span className="px-9">{item}</span>
            <span className="size-2 rotate-45 bg-mint" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Shop by price ─────────────────────────────────────────────────────── */

const TONES = {
  brand: "bg-brand text-white [--sub:var(--color-mint)] [--ghost:oklch(100%_0_0/0.08)]",
  mint: "bg-mint text-brand [--sub:var(--color-brand)] [--ghost:oklch(100%_0_0/0.3)]",
  gold: "bg-gold text-brand [--sub:var(--color-brand)] [--ghost:oklch(100%_0_0/0.35)]",
  coral: "bg-coral text-white [--sub:oklch(100%_0_0)] [--ghost:oklch(100%_0_0/0.18)]",
} as const;

export function PriceTiles() {
  return (
    <section className="mt-14 sm:mt-16">
      <Container>
        <SectionHeader title="Shop by price" href="/shop" />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {PRICE_TIERS.map((tier) => (
            <Link
              key={tier.max}
              href={`/shop?price=${tier.max}`}
              className={`press group relative h-24 overflow-hidden rounded-2xl p-4 sm:h-28 sm:p-5 ${TONES[tier.tone]} [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:shadow-[0_16px_30px_-16px_oklch(22.51%_0.051_255.57/0.5)]`}
            >
              <p className="font-display text-xl leading-none font-bold tracking-tight sm:text-2xl">{cedis(tier.max)}</p>
              <p className="mt-1.5 text-[11px] font-semibold tracking-wide text-[var(--sub)] uppercase">&amp; below</p>
              <span className="absolute -right-2 -bottom-4 font-display text-6xl font-bold tracking-tighter text-[var(--ghost)] sm:text-7xl">
                {tier.max >= 1000 ? `${tier.max / 1000}k` : tier.max}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ─── Deals panel ───────────────────────────────────────────────────────── */

export function DealsPanel({ deals }: { deals: Product[] }) {
  return (
    <section className="mt-12 sm:mt-14">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] bg-brand px-5 py-8 sm:p-10">
          <div className="pointer-events-none absolute -top-40 -right-24 size-[34rem] rounded-full bg-[radial-gradient(closest-side,oklch(77.33%_0.1736_160.47/0.28),transparent)]" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display text-[1.7rem] leading-[1.05] font-bold tracking-tight text-white uppercase sm:text-4xl">
              The same pieces.
              <br />
              <span className="text-mint">Marked down.</span>
            </h2>
            <Link
              href="/shop?sale=1"
              className="press inline-flex h-12 w-fit items-center rounded-full bg-white px-6 font-semibold text-brand uppercase hover:bg-ice"
            >
              Shop all deals
            </Link>
          </div>
          <div className="no-scrollbar relative -mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
            {deals.map((p) => (
              <Link
                key={p.slug}
                href={`/shop/${p.slug}`}
                className="press group w-[78%] shrink-0 snap-start rounded-2xl border border-white/10 bg-white/[0.06] p-4 transition-colors hover:bg-white/[0.1] sm:w-auto"
              >
                <div className="flex items-center justify-between gap-2 text-[13px] text-white/70">
                  <span>{p.category}</span>
                  <span className="rounded bg-mint px-1.5 py-0.5 text-[10px] font-bold text-brand uppercase">
                    Save {cedis((p.originalPrice ?? p.price) - p.price)}
                  </span>
                </div>
                <div className="relative mt-3 aspect-[4/3] overflow-hidden rounded-xl bg-ice">
                  <Image
                    src={productImageSrc(p.slug)}
                    alt={p.name}
                    fill
                    sizes="(min-width: 640px) 33vw, 78vw"
                    className="object-cover transition-transform duration-700 ease-[var(--ease-out)] [@media(hover:hover)]:group-hover:scale-[1.04]"
                  />
                </div>
                <p className="mt-4 font-semibold text-white">{p.name}</p>
                <p className="tabular mt-1 flex items-baseline gap-2">
                  <span className="text-sm text-white/50 line-through">{cedis(p.originalPrice ?? p.price)}</span>
                  <span className="font-display text-2xl font-bold text-mint">{cedis(p.price)}</span>
                </p>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ─── Categories ────────────────────────────────────────────────────────── */

export function CategoryGrid({ counts }: { counts: Record<string, number> }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
      {CATEGORIES.map((c, i) => (
        <Link
          key={c.name}
          href={`/shop?category=${c.name}`}
          className={`press group overflow-hidden rounded-[1.25rem] border border-line bg-white ${i === 4 ? "col-span-2 md:col-span-1" : ""}`}
        >
          <div className={`relative overflow-hidden bg-ice ${i === 4 ? "aspect-[2/1] md:aspect-square" : "aspect-square"}`}>
            <Image
              src={c.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 20vw, 50vw"
              className="object-cover transition-transform duration-700 ease-[var(--ease-out)] [@media(hover:hover)]:group-hover:scale-[1.05]"
            />
          </div>
          <div className="flex items-baseline justify-between gap-2 px-3.5 py-3">
            <p className="font-semibold text-ink">{c.name}</p>
            <p className="tabular text-xs text-slate">
              {counts[c.name] ?? 0} {counts[c.name] === 1 ? "piece" : "pieces"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
