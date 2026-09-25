import { products, getProductBySlug, isLowStock, CATEGORIES } from "@/lib/products";
import { Hero, Ticker, PriceTiles, DealsPanel, CategoryGrid } from "@/components/home";
import { Container, ProductRow, SectionHeader } from "@/components/Section";
import { BundlePanel } from "@/components/BundlePanel";
import { Newsletter } from "@/components/Newsletter";

const LOOK = ["silk-charmeuse-shirt", "wool-wide-leg-trouser", "minimal-gold-hoop", "quilted-crossbody"];

export default function Home() {
  const deals = products.filter((p) => p.originalPrice);
  const newArrivals = products.filter((p) => p.isFeatured).slice(-4).reverse();
  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 4);
  const almostGone = products.filter(isLowStock).slice(0, 4);
  const look = LOOK.map(getProductBySlug).filter((p) => p !== undefined);
  const counts = Object.fromEntries(CATEGORIES.map((c) => [c.name, products.filter((p) => p.category === c.name).length]));
  const lowest = Math.min(...products.map((p) => p.price));

  return (
    <main>
      <Hero lead={products[0]} second={getProductBySlug("structured-leather-tote") ?? products[1]} from={lowest} />
      <Ticker />
      <PriceTiles />
      <DealsPanel deals={deals.slice(0, 3)} />
      <ProductRow title="New arrivals" href="/shop?sort=newest" products={newArrivals} />
      <ProductRow title="Bestsellers" href="/shop?sort=popular" products={bestsellers} />
      <ProductRow title="Almost gone" href="/shop?stock=low" products={almostGone} />

      <section className="mt-16 sm:mt-20">
        <Container>
          <SectionHeader title="Shop by category" href="/categories" linkLabel="All categories" />
          <CategoryGrid counts={counts} />
        </Container>
      </section>

      <section className="mt-16 sm:mt-20">
        <Container>
          <BundlePanel title="Complete the look" products={look} />
        </Container>
      </section>

      <section className="mt-16 sm:mt-20">
        <Container>
          <Newsletter />
        </Container>
      </section>
    </main>
  );
}
