export type Product = {
  slug: string;
  name: string;
  category: "Perfumes" | "Bags" | "Clothing" | "Accessories" | "Beauty";
  price: number;
  originalPrice?: number;
  discountTag?: string;
  description: string;
  details: string;
  delivery: string;
  sizes?: string[];
  isFeatured?: boolean;
  isBestseller?: boolean;
  stockQuantity?: number;
};

export const products: Product[] = [
  {
    slug: "ambre-noir-eau-de-parfum",
    name: "Labadi Coast Eau de Parfum",
    category: "Perfumes",
    price: 1850,
    originalPrice: 2100,
    discountTag: "-GH₵ 250",
    description:
      "A smoked amber and coastal vetiver composition layered with dark resin and Ghanaian cedarwood. Understated, evocative, and exceptionally long-wearing.",
    details: "100ml. Extrait de Parfum, 22% concentration. Hand-blended in Grasse & Accra.",
    delivery: "Same-day express delivery in Greater Accra (Cantonments, Osu, East Legon). 48-hour delivery across Ghana.",
    isFeatured: true,
    isBestseller: true,
    stockQuantity: 18,
  },
  {
    slug: "structured-leather-tote",
    name: "Osu Leather Architecture Tote",
    category: "Bags",
    price: 4600,
    description:
      "Architectural full-grain calfskin crafted in a single clean silhouette. Suede-lined interior designed for urban ease and quiet authority.",
    details: "Full-grain calfskin, solid brass hardware, brushed suede lining. Handcrafted in Florence & Accra.",
    delivery: "Complimentary white-glove delivery in Greater Accra. Standard insured shipping nationwide.",
    isFeatured: true,
    stockQuantity: 8,
  },
  {
    slug: "wool-wide-leg-trouser",
    name: "Cantonments Tailored Linen Trouser",
    category: "Clothing",
    price: 2200,
    description:
      "Heavyweight breathable linen-wool blend with a fluid drape and a high tailored waistband. Designed for tropical elegance and effortless movement.",
    details: "70% organic linen, 30% virgin wool. Dry clean or delicate cool wash. Made in Portugal.",
    delivery: "Express delivery within 24–48 hours across Ghana. Free exchanges.",
    sizes: ["XS", "S", "M", "L", "XL"],
    isFeatured: true,
    stockQuantity: 14,
  },
  {
    slug: "silk-charmeuse-shirt",
    name: "Kente-Weave Silk Charmeuse Shirt",
    category: "Clothing",
    price: 2450,
    originalPrice: 2800,
    discountTag: "-GH₵ 350",
    description:
      "Liquid Mulberry silk featuring a subtle jacquard geometric weave inspired by heritage West African patterns. Drapes effortlessly for warm tropical evenings.",
    details: "100% Mulberry silk charmeuse. Concealed mother-of-pearl placket. Dry clean only.",
    delivery: "Same-day dispatch in Accra. 48-hour delivery nationwide.",
    sizes: ["XS", "S", "M", "L"],
    isFeatured: true,
    isBestseller: true,
    stockQuantity: 11,
  },
  {
    slug: "cashmere-crewneck",
    name: "Asante Light Cashmere Knit",
    category: "Clothing",
    price: 2800,
    description:
      "Ultra-fine 16-gauge Grade-A Mongolian cashmere with ribbed trims and a relaxed contemporary cut. Temperature-regulating for air-conditioned evenings.",
    details: "100% Grade-A Mongolian Cashmere. Hand wash cold or dry clean.",
    delivery: "Express 24-hour delivery in Greater Accra.",
    sizes: ["S", "M", "L", "XL"],
    isFeatured: true,
    stockQuantity: 9,
  },
  {
    slug: "minimal-gold-hoop",
    name: "Ridge Gold Vermeil Hoop",
    category: "Accessories",
    price: 1250,
    description:
      "18k gold vermeil over recycled sterling silver with a subtle sculpted ridge design. Lightweight hollow core designed for all-day comfort.",
    details: "18k Gold Vermeil (2.5 microns) over 925 Sterling Silver. Hinge closure.",
    delivery: "Same-day express delivery in Greater Accra in signature box.",
    isBestseller: true,
    stockQuantity: 22,
  },
  {
    slug: "vetiver-hand-balm",
    name: "Akropong Botanical Hand Balm",
    category: "Beauty",
    price: 420,
    description:
      "Nourishing botanical hand cream enriched with raw unrefined shea butter, baobab oil, and wild Haitian vetiver. Restores moisture immediately.",
    details: "75ml aluminum tube. Organic West African Shea Butter & Cold-Pressed Baobab.",
    delivery: "Express delivery across Greater Accra & Ghana nationwide.",
    isFeatured: true,
    stockQuantity: 34,
  },
  {
    slug: "matte-silk-lip-oil",
    name: "Prampram Sun Lip Oil",
    category: "Beauty",
    price: 480,
    description:
      "Non-sticky tinted botanical lip treatment with SPF 15 and jojoba seed oil. Leaves a subtle rosy sheen and continuous hydration.",
    details: "8ml glass vial with plush applicator. Organic jojoba, vitamin E, marula oil.",
    delivery: "Same-day delivery in Accra.",
    isBestseller: true,
    stockQuantity: 45,
  },
  {
    slug: "quilted-crossbody",
    name: "Nima Quilted Evening Crossbody",
    category: "Bags",
    price: 3900,
    originalPrice: 4300,
    discountTag: "-GH₵ 400",
    description:
      "Butter-soft nappa leather in a geometric quilt pattern with a convertible gold curb chain strap. Fits phone, cards, key, and lip balm seamlessly.",
    details: "Nappa leather, magnetic flap lock, gold-tone chain. Interior zip pocket.",
    delivery: "Express 24-hour delivery across Greater Accra.",
    isFeatured: true,
    stockQuantity: 6,
  },
  {
    slug: "tailored-wool-coat",
    name: "Aburi Double-Faced Wool Coat",
    category: "Clothing",
    price: 4950,
    description:
      "Unstructured double-faced virgin wool coat with relaxed lapels and hand-stitched seams. Statement outerwear for international travel and crisp highland evenings.",
    details: "100% Virgin Wool. Unlined double-faced construction. Horn buttons.",
    delivery: "Complimentary courier delivery across Ghana.",
    sizes: ["S", "M", "L"],
    isFeatured: true,
    stockQuantity: 5,
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

const PRODUCT_IMAGE_MAP: Record<string, string> = {
  "ambre-noir-eau-de-parfum": "/images/product-ambre-noir-eau-de-parfum.jpg",
  "structured-leather-tote": "/images/product-structured-leather-tote.jpg",
  "wool-wide-leg-trouser": "/images/product-wool-wide-leg-trouser.jpg",
  "silk-charmeuse-shirt": "/images/product-silk-charmeuse-shirt.jpg",
  "cashmere-crewneck": "/images/product-cashmere-crewneck.jpg",
  "minimal-gold-hoop": "/images/product-minimal-gold-hoop.jpg",
  "vetiver-hand-balm": "/images/product-vetiver-hand-balm.jpg",
  "matte-silk-lip-oil": "/images/product-matte-silk-lip-oil.jpg",
  "quilted-crossbody": "/images/product-quilted-crossbody.jpg",
  "tailored-wool-coat": "/images/product-tailored-wool-coat.jpg",
};

export function productImageSrc(slug: string) {
  return PRODUCT_IMAGE_MAP[slug] || "/images/product-ambre-noir-eau-de-parfum.jpg";
}

export type Category = Product["category"];

export const CATEGORIES: { name: Category; blurb: string; image: string }[] = [
  { name: "Perfumes", blurb: "Extraits and eaux de parfum", image: "/images/category-perfumes.jpg" },
  { name: "Bags", blurb: "Totes and evening crossbodies", image: "/images/category-bags.jpg" },
  { name: "Clothing", blurb: "Linen, silk, cashmere and wool", image: "/images/category-clothing.jpg" },
  { name: "Accessories", blurb: "Gold vermeil and fine leather", image: "/images/category-accessories.jpg" },
  { name: "Beauty", blurb: "Shea balms and lip oils", image: "/images/category-beauty.jpg" },
];

export const PRICE_TIERS = [
  { max: 500, tone: "brand" },
  { max: 1000, tone: "mint" },
  { max: 2500, tone: "gold" },
  { max: 5000, tone: "coral" },
] as const;

export function categoryImageSrc(category: string) {
  return CATEGORIES.find((c) => c.name.toLowerCase() === category.toLowerCase())?.image ?? "/images/category-perfumes.jpg";
}

export function isLowStock(product: Product) {
  return product.stockQuantity !== undefined && product.stockQuantity < 10;
}
