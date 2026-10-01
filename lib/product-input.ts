import { CATEGORIES, type Category } from "@/lib/products";

export type ProductFieldErrors = Partial<Record<
  "name" | "slug" | "category" | "price" | "originalPrice" | "stockQuantity" | "imageUrl" | "description" | "form",
  string
>>;

export type ProductInput = {
  slug: string;
  name: string;
  category: Category;
  price: number;
  original_price: number | null;
  description: string;
  details: string;
  delivery: string;
  sizes: string[] | null;
  is_featured: boolean;
  is_bestseller: boolean;
  stock_quantity: number;
  image_url: string;
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function text(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}

function wholeNumber(value: string) {
  return /^\d+$/.test(value) ? Number(value) : NaN;
}

/** Validates the admin product form. Shared by the server action and kept free of server-only imports. */
export function parseProductForm(form: FormData): { data?: ProductInput; errors: ProductFieldErrors } {
  const errors: ProductFieldErrors = {};

  const name = text(form, "name");
  const slug = text(form, "slug");
  const category = text(form, "category") as Category;
  const price = wholeNumber(text(form, "price").replace(/,/g, ""));
  const originalRaw = text(form, "originalPrice").replace(/,/g, "");
  const originalPrice = originalRaw ? wholeNumber(originalRaw) : null;
  const stock = wholeNumber(text(form, "stockQuantity"));
  const imageUrl = text(form, "imageUrl");
  const sizes = text(form, "sizes")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!name) errors.name = "Give the product a name.";
  else if (name.length > 120) errors.name = "Keep the name under 120 characters.";

  if (!slug) errors.slug = "Add a web address.";
  else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) errors.slug = "Use lowercase letters, numbers and single hyphens only.";

  if (!CATEGORIES.some((c) => c.name === category)) errors.category = "Pick a category.";

  if (!Number.isFinite(price) || price <= 0) errors.price = "Enter a price in whole cedis, above 0.";

  if (originalPrice !== null) {
    if (!Number.isFinite(originalPrice)) errors.originalPrice = "Enter the old price in whole cedis.";
    else if (Number.isFinite(price) && originalPrice <= price) errors.originalPrice = "The old price must be higher than the current price.";
  }

  if (!Number.isFinite(stock)) errors.stockQuantity = "Enter a stock count of 0 or more.";

  if (!imageUrl) errors.imageUrl = "Upload a product photo.";

  if (!text(form, "description")) errors.description = "Add a short description.";

  if (Object.keys(errors).length > 0) return { errors };

  return {
    errors,
    data: {
      slug,
      name,
      category,
      price,
      original_price: originalPrice,
      description: text(form, "description"),
      details: text(form, "details"),
      delivery: text(form, "delivery"),
      sizes: sizes.length ? sizes : null,
      is_featured: form.get("isFeatured") === "on",
      is_bestseller: form.get("isBestseller") === "on",
      stock_quantity: stock,
      image_url: imageUrl,
    },
  };
}
