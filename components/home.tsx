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
      <Container className="grid items-center gap-8 pt-8 pb-10 sm:gap-10 sm:pt-16 sm:pb-14 lg:grid-cols-[1.1fr_1fr] lg:pt-20 lg:pb-20">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-[11px] font-semibold sm:px-3.5 sm:text-xs text-brand uppercase shadow-[0_2px_8px_-4px_oklch(30%_0.03_45/0.2)]">
            <span className="size-2 rounded-full bg-mint" />
            Order by 2 PM, wear it tonight
          </p>
          <h1 className="mt-5 font-display sm:mt-6 text-[clamp(1.75rem,0.6rem+6.2vw,3.75rem)] leading-[1.02] font-bold tracking-[-0.025em] text-ink uppercase">
            Perfume, leather
            <br />
            &amp; silk in Accra,
            <br />
            <span className="text-mint-deep">by tonight.</span>
          </h1>
          <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-slate sm:mt-6 sm:text-lg">
            Extraits de parfum, full-grain leather, linen and silk, chosen in Accra and delivered to your door the same day.
          </p>
          <div className="mt-7 grid grid-cols-1 gap-2.5 min-[400px]:grid-cols-2 sm:mt-8 sm:flex sm:gap-3">
            <Link
              href="/shop"
              className="press inline-flex h-[52px] items-center justify-center rounded-full bg-brand px-4 text-sm font-semibold whitespace-nowrap text-white uppercase hover:bg-brand-soft sm:px-7 sm:text-base"
            >
              Shop now
            </Link>
            <Link
              href="/shop?sort=newest"
              className="press inline-flex h-[52px] items-center justify-center rounded-full border border-line bg-white px-4 text-sm font-semibold whitespace-nowrap text-brand uppercase hover:border-brand sm:px-7 sm:text-base"
            >
              See what&apos;s new
            </Link>
          </div>
          <p className="mt-5 flex items-start gap-2 text-base leading-snug text-slate sm:items-center sm:text-sm">
            <Check size={16} weight="bold" className="mt-1 shrink-0 text-mint-deep sm:mt-0" />
            Same-day in Cantonments, Osu, East Legon &amp; Airport Hills. 48 hours nationwide.
          </p>
        </div>

        {/* Floating product cards */}
        <div className="relative mx-auto h-[300px] w-full max-w-[560px] min-[400px]:h-[340px] sm:h-[440px]" aria-hidden>
          <div className="absolute inset-[10%] rounded-full bg-mint/30 blur-3xl" />

          <HeroCard product={lead} className="top-[2%] left-0 w-[50%] [--r:-5deg] sm:left-[3%] sm:w-[45%]" delay={80}>
            <div className="flex items-start justify-between gap-2">
              <p className="line-clamp-1 text-xs leading-tight font-semibold text-ink sm:line-clamp-2 sm:text-[13px]">{lead.name}</p>
              {off > 0 && (
                <span className="shrink-0 rounded bg-mint px-1.5 py-0.5 text-[9px] font-bold text-ink uppercase">{off}% off</span>
              )}
            </div>
            <p className="mt-1 flex items-baseline gap-2">
              {lead.originalPrice && <span className="hidden text-[11px] text-slate line-through min-[400px]:inline">{cedis(lead.originalPrice)}</span>}
              <span className="font-display text-base font-bold text-ink sm:text-lg">{cedis(lead.price)}</span>
            </p>
          </HeroCard>

          <HeroCard product={second} className="right-0 bottom-[2%] w-[47%] [--r:4deg] sm:right-[2%] sm:w-[42%]" delay={200}>
            <div className="flex items-start justify-between gap-2">
              <p className="line-clamp-1 text-xs leading-tight font-semibold text-ink sm:line-clamp-2 sm:text-[13px]">{second.name}</p>
              <span className="shrink-0 rounded bg-gold px-1.5 py-0.5 text-[9px] font-bold text-ink uppercase">New</span>
            </div>
            <p className="mt-1 font-display text-base font-bold text-ink sm:text-lg">{cedis(second.price)}</p>
          </HeroCard>

          <div
            className="hero-card absolute top-[3%] right-[8%] grid size-[24%] min-w-[88px] place-items-center rounded-full bg-brand text-center shadow-[0_20px_40px_-12px_oklch(30%_0.03_45/0.55)] [transform:rotate(var(--r))] [--r:0deg]"
            style={{ animationDelay: "320ms" }}
          >
            <div>
              <p className="text-[9px] font-bold tracking-[0.18em] text-sand uppercase">From</p>
              <p className="font-display text-lg leading-none font-bold text-white sm:text-2xl">{cedis(from)}</p>
            </div>
          </div>

          <div
            className="hero-card absolute bottom-[4%] left-[4%] w-[40%] rounded-2xl bg-coral p-3 sm:left-[10%] sm:w-[34%] sm:p-3.5 text-white shadow-[0_18px_36px_-14px_oklch(48%_0.1_40/0.55)] [transform:rotate(var(--r))] [--r:-3deg] sm:p-4"
            style={{ animationDelay: "440ms" }}
          >
            <p className="text-[9px] font-bold tracking-wide uppercase opacity-90">Greater Accra</p>
            <p className="mt-1 font-display text-sm leading-tight font-bold uppercase min-[400px]:text-base sm:text-lg">Same-day delivery.</p>
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
      className={`hero-card absolute rounded-2xl bg-white p-2 sm:rounded-[1.25rem] sm:p-2.5 shadow-[0_24px_48px_-20px_oklch(30%_0.03_45/0.4)] [transform:rotate(var(--r))] ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative aspect-[4/3.4] overflow-hidden rounded-xl bg-ice">
        <Image src={productImageSrc(product.slug)} alt="" fill priority sizes="260px" className="object-cover" />
      </div>
      <div className="px-1 pt-2 pb-0.5 sm:pt-2.5 sm:pb-1">{children}</div>
    </div>
  );
}

/* ─── Ticker ────────────────────────────────────────────────────────────── */

const TICKER = ["Same-day in Accra", "Extraits de parfum", "Full-grain leather", "Linen & silk", "18k gold vermeil", "Pay with MoMo"];

export function Ticker() {
  const items = [...TICKER, ...TICKER];
  return (
    <div className="overflow-hidden bg-brand py-3 text-white sm:py-3.5" aria-hidden>
      <div className="animate-ticker flex w-max">
        {items.map((item, i) => (
          <span key={i} className="flex items-center font-display text-[13px] font-bold tracking-[0.06em] whitespace-nowrap uppercase sm:text-sm">
            <span className="px-6 sm:px-9">{item}</span>
            <span className="size-2 rotate-45 bg-sand" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Shop by price ─────────────────────────────────────────────────────── */

const TONES = {
  brand: "bg-brand text-white [--sub:var(--color-sand)] [--ghost:oklch(100%_0_0/0.1)]",
  mint: "bg-mint text-ink [--sub:var(--color-ink)] [--ghost:oklch(100%_0_0/0.28)]",
  gold: "bg-gold text-ink [--sub:var(--color-brand)] [--ghost:oklch(100%_0_0/0.5)]",
  coral: "bg-coral text-white [--sub:oklch(100%_0_0)] [--ghost:oklch(100%_0_0/0.18)]",
} as const;

export function PriceTiles() {
  return (
    <section className="mt-10 sm:mt-16">
      <Container>
        <SectionHeader title="Shop by price" href="/shop" />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {PRICE_TIERS.map((tier) => (
            <Link
              key={tier.max}
              href={`/shop?price=${tier.max}`}
              className={`press group relative h-[5.5rem] overflow-hidden rounded-2xl p-3.5 min-[400px]:h-24 min-[400px]:p-4 sm:h-28 sm:p-5 ${TONES[tier.tone]} [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:shadow-[0_16px_30px_-16px_oklch(30%_0.03_45/0.5)]`}
            >
              <p className="font-display text-[clamp(1.05rem,0.7rem+1.6vw,1.5rem)] leading-none font-bold tracking-tight">{cedis(tier.max)}</p>
              <p className="mt-1.5 text-xs font-semibold tracking-wide text-[var(--sub)] uppercase">&amp; below</p>
              <span className="absolute -right-2 -bottom-3 font-display text-[clamp(2.75rem,1.5rem+5vw,4.5rem)] leading-none font-bold tracking-tighter text-[var(--ghost)]">
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
    <section className="mt-10 sm:mt-14">
      <Container>
        <div className="relative overflow-hidden rounded-[1.75rem] bg-brand px-4 py-7 sm:rounded-[2rem] sm:p-10">
          <div className="pointer-events-none absolute -top-40 -right-24 size-[34rem] rounded-full bg-[radial-gradient(closest-side,oklch(76%_0.035_55/0.28),transparent)]" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display text-[clamp(1.5rem,1rem+2.6vw,2.25rem)] leading-[1.05] font-bold tracking-tight text-white uppercase">
              The same pieces.
              <br />
              <span className="text-sand">Marked down.</span>
            </h2>
            <Link
              href="/shop?sale=1"
              className="press inline-flex h-12 w-fit items-center rounded-full bg-cream px-6 text-sm font-semibold text-brand uppercase hover:bg-white sm:text-base"
            >
              Shop all deals
            </Link>
          </div>
          <div className="no-scrollbar relative -mx-4 mt-7 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:mt-8 sm:gap-4 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
            {deals.map((p) => (
              <Link
                key={p.slug}
                href={`/shop/${p.slug}`}
                className="press group w-[80%] max-w-[300px] shrink-0 snap-start rounded-2xl border border-white/10 bg-white/[0.06] p-3.5 sm:max-w-none sm:p-4 transition-colors hover:bg-white/[0.1] sm:w-auto"
              >
                <div className="flex items-center justify-between gap-2 text-sm text-white/70">
                  <span className="truncate">{p.category}</span>
                  <span className="shrink-0 rounded bg-mint px-1.5 py-0.5 text-[11px] font-bold whitespace-nowrap text-ink uppercase">
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
                  <span className="font-display text-2xl font-bold text-sand">{cedis(p.price)}</span>
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
          <div className="flex flex-col gap-0.5 px-3 py-2.5 min-[420px]:flex-row min-[420px]:items-baseline min-[420px]:justify-between min-[420px]:gap-2 sm:px-3.5 sm:py-3">
            <p className="truncate text-[15px] font-semibold text-ink sm:text-base">{c.name}</p>
            <p className="tabular shrink-0 text-xs text-slate">
              {counts[c.name] ?? 0} {counts[c.name] === 1 ? "piece" : "pieces"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
