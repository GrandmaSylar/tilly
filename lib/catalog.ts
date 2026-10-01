import "server-only";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import type { Category, Product } from "@/lib/products";

export const PRODUCTS_TAG = "products";

export type ProductRow = {
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
  sort_order: number;
};

export type Activity = {
  id: string;
  action: "create" | "update" | "delete" | "stock" | "flag";
  product_slug: string;
  summary: string;
  created_at: Date;
};

export function rowToProduct(row: ProductRow): Product {
  return {
    slug: row.slug,
    name: row.name,
    category: row.category,
    price: row.price,
    originalPrice: row.original_price ?? undefined,
    description: row.description,
    details: row.details,
    delivery: row.delivery,
    sizes: row.sizes?.length ? row.sizes : undefined,
    isFeatured: row.is_featured,
    isBestseller: row.is_bestseller,
    stockQuantity: row.stock_quantity,
    imageUrl: row.image_url,
  };
}

/** Uncached read, used by the admin area so it always shows the latest data. */
export async function fetchProducts(): Promise<Product[]> {
  const rows = await db()`select * from products order by sort_order, created_at`;
  return (rows as ProductRow[]).map(rowToProduct);
}

/** Storefront read. Cached until an admin change calls revalidateTag(PRODUCTS_TAG). */
export const getProducts = unstable_cache(fetchProducts, ["products"], { tags: [PRODUCTS_TAG] });

export async function getProduct(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug);
}

export async function fetchActivity(limit = 10): Promise<Activity[]> {
  const rows = await db()`select * from activity_log order by created_at desc limit ${limit}`;
  return rows as Activity[];
}

/* ─── Storage ───────────────────────────────────────────────────────────── */

/** Neon's free plan allows 0.5 GB per project. Override if the plan changes. */
const STORAGE_LIMIT_BYTES = Number(process.env.NEON_STORAGE_LIMIT_MB || 512) * 1024 * 1024;

export type StorageUsage = {
  limit: number;
  used: number;
  products: number;
  activity: number;
  system: number;
  productCount: number;
  /** Average bytes one product takes on disk, including its share of indexes. */
  bytesPerProduct: number;
};

/**
 * Exact on-disk size of every database on this Neon branch (what the plan
 * limit counts), split into the product table, the activity log and
 * everything else (Postgres's own system catalogs).
 */
export async function fetchStorageUsage(): Promise<StorageUsage> {
  const [row] = await db()`
    select
      (select coalesce(sum(pg_database_size(datname)), 0)
         from pg_database
        where not datistemplate and has_database_privilege(datname, 'CONNECT'))::bigint as used,
      pg_total_relation_size('products')::bigint as products,
      pg_total_relation_size('activity_log')::bigint as activity,
      (select count(*) from products)::int as product_count,
      (select coalesce(avg(pg_column_size(p.*)), 0) from products p)::float as avg_row
  `;

  const used = Number(row.used);
  const products = Number(row.products);
  const activity = Number(row.activity);
  const productCount = Number(row.product_count);
  // Row size plus ~60% for index entries and page overhead; at least 1 KB so the estimate stays conservative.
  const bytesPerProduct = Math.max(1024, Math.round(Number(row.avg_row) * 1.6));

  return {
    limit: STORAGE_LIMIT_BYTES,
    used,
    products,
    activity,
    system: Math.max(0, used - products - activity),
    productCount,
    bytesPerProduct,
  };
}
