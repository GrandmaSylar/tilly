export type Product = {
  slug: string;
  name: string;
  category: "Perfumes" | "Bags" | "Clothing" | "Accessories" | "Beauty";
  price: number;
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
    description:
      "Liquid Mulberry silk featuring a subtle jacquard geometric weave inspired by heritage West African patterns. Drapes effortlessly for warm tropical evenings.",
    details: "100% Mulberry silk charmeuse. Concealed mother-of-pearl placket. Dry clean only.",
    delivery: "Same-day dispatch in Accra. 48-hour delivery nationwide.",
    sizes: ["XS", "S", "M", "L"],
    isBestseller: true,
    stockQuantity: 11,
  },
  {
    slug: "cashmere-crewneck",
    name: "Asante Light Cashmere Knit",
    category: "Clothing",
    price: 2800,
    description:
      "Ultralight 2-ply cashmere knit to a soft, relaxed drape. Designed for air-conditioned spaces, travel, and cool harmattan evenings.",
    details: "100% Grade-A Mongolian cashmere. Hand wash cold with cashmere wash.",
    delivery: "Express delivery in Greater Accra & nationwide Ghana delivery.",
    sizes: ["XS", "S", "M", "L", "XL"],
    stockQuantity: 9,
  },
  {
    slug: "minimal-gold-hoop",
    name: "Ridge Gold Vermeil Hoop",
    category: "Accessories",
    price: 1250,
    description:
      "A sculpted continuous hoop cast in 18k recycled gold vermeil over sterling silver. A quiet statement piece worn alone or paired.",
    details: "18k gold vermeil over 925 sterling silver. Hypoallergenic post closure.",
    delivery: "Delivered in signature velvet luxury pouch. Same-day delivery in Accra.",
    isBestseller: true,
    stockQuantity: 22,
  },
  {
    slug: "fine-leather-belt",
    name: "Fine Calfskin Waist Belt",
    category: "Accessories",
    price: 850,
    description:
      "Narrow hand-burnished calfskin belt with a custom hand-brushed brass buckle. Designed to define waistlines with subtlety.",
    details: "Hand-burnished Italian calfskin, solid brass hardware. Made in Italy.",
    delivery: "Ships within 24 hours. Complimentary returns within 14 days.",
    sizes: ["S", "M", "L"],
    stockQuantity: 15,
  },
  {
    slug: "cashmere-travel-scarf",
    name: "Volta Hand-Woven Scarf",
    category: "Accessories",
    price: 1150,
    description:
      "An oversized cashmere and raw silk wrap woven in soft earthy sand tones. Versatile over evening tailoring or international travel.",
    details: "70% cashmere, 30% hand-spun silk. Dry clean only.",
    delivery: "Same-day express delivery in Accra.",
    stockQuantity: 6,
  },
  {
    slug: "vetiver-hand-balm",
    name: "Akropong Botanical Hand Balm",
    category: "Beauty",
    price: 420,
    description:
      "A dense, fast-absorbing botanical balm enriched with raw unrefined Ghanaian shea butter, baobab oil, and smoked vetiver.",
    details: "75ml. Wild-harvested shea butter, cold-pressed baobab, vitamin E, vetiver.",
    delivery: "Same-day express delivery in Greater Accra & Airport Residential pickup.",
    isBestseller: true,
    stockQuantity: 35,
  },
  {
    slug: "matte-silk-lip-oil",
    name: "Prampram Sun Lip Oil",
    category: "Beauty",
    price: 480,
    description:
      "A weightless nourishing lip oil infused with West African marula oil that sets into a luminous, low-shine finish.",
    details: "10ml. Cold-pressed marula oil, organic jojoba, vitamin E.",
    delivery: "Delivered in signature luxury pouch across Ghana.",
    stockQuantity: 40,
  },
  {
    slug: "quilted-crossbody",
    name: "Nima Quilted Evening Crossbody",
    category: "Bags",
    price: 3900,
    description:
      "Supple lambskin leather intricately quilted with a fine brass chain strap. Designed for seamless transition from day to evening.",
    details: "Italian lambskin leather, antique brass hardware. Interior card slot.",
    delivery: "Complimentary white-glove express delivery across Accra & Kumasi.",
    isFeatured: true,
    stockQuantity: 5,
  },
  {
    slug: "tailored-wool-coat",
    name: "Aburi Double-Faced Wool Coat",
    category: "Clothing",
    price: 4950,
    description:
      "A single-breasted coat in double-faced wool and silk, cut long with unlined lightness. Designed for refined international travel.",
    details: "85% virgin wool, 15% Mulberry silk. Dry clean only. Made in Portugal.",
    delivery: "Insured express courier delivery across Ghana & worldwide DHL Express.",
    sizes: ["XS", "S", "M", "L", "XL"],
    stockQuantity: 4,
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function productImageSrc(slug: string) {
  return `/images/product-${slug}.jpg`;
}

export function categoryImageSrc(category: string) {
  return `/images/category-${category.toLowerCase()}.jpg`;
}

