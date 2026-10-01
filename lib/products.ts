import { cloudinaryUrl } from "@/lib/cloudinary";

export type Product = {
  slug: string;
  name: string;
  category: "Perfumes" | "Bags" | "Clothing" | "Accessories" | "Beauty";
  price: number;
  originalPrice?: number;
  description: string;
  details: string;
  delivery: string;
  sizes?: string[];
  isFeatured?: boolean;
  isBestseller?: boolean;
  stockQuantity: number;
  imageUrl: string;
};

export type Category = Product["category"];

const FALLBACK_IMAGE = "/images/category-perfumes.jpg";

/** Product photo URL; Cloudinary images are resized and auto-formatted on the fly. */
export function productImageSrc(product: Pick<Product, "imageUrl">, width = 900) {
  return product.imageUrl ? cloudinaryUrl(product.imageUrl, width) : FALLBACK_IMAGE;
}

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
  return CATEGORIES.find((c) => c.name.toLowerCase() === category.toLowerCase())?.image ?? FALLBACK_IMAGE;
}

export const LOW_STOCK_THRESHOLD = 10;

export function isSoldOut(product: Pick<Product, "stockQuantity">) {
  return product.stockQuantity <= 0;
}

export function isLowStock(product: Pick<Product, "stockQuantity">) {
  return product.stockQuantity > 0 && product.stockQuantity < LOW_STOCK_THRESHOLD;
}
