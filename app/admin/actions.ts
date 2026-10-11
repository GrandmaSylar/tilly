"use server";

import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { after } from "next/server";
import { db } from "@/lib/db";
import { PRODUCTS_TAG, type Activity } from "@/lib/catalog";
import { endSession, requireAdmin, startSession } from "@/lib/admin-auth";
import { adminPath } from "@/lib/admin-path";
import { safeEqual } from "@/lib/admin-session";
import { deleteUploadedImage, isAllowedImageUrl } from "@/lib/cloudinary-server";
import { parseProductForm, type ProductFieldErrors } from "@/lib/product-input";
import { cedis } from "@/lib/format";

/* ─── Session ───────────────────────────────────────────────────────────── */

const MAX_FAILURES = 5;
const LOCKOUT_MINUTES = 15;

/** Minutes left on the lockout, or 0 when password sign-in is open. */
async function lockedForMinutes() {
  const rows = await db()`
    select created_at from admin_login_attempts
    where created_at > now() - make_interval(mins => ${LOCKOUT_MINUTES})
    order by created_at desc limit ${MAX_FAILURES}`;
  if (rows.length < MAX_FAILURES) return 0;
  const unlocks = new Date(rows[0].created_at as string).getTime() + LOCKOUT_MINUTES * 60_000;
  return Math.max(1, Math.ceil((unlocks - Date.now()) / 60_000));
}

export async function login(_prev: { error?: string }, form: FormData): Promise<{ error?: string }> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return { error: "Admin login isn't configured yet. Set ADMIN_PASSWORD." };

  const wait = await lockedForMinutes();
  if (wait) return { error: `Too many wrong passwords. Try again in ${wait} minute${wait === 1 ? "" : "s"}, or use your passkey.` };

  const password = String(form.get("password") ?? "");
  if (!safeEqual(password, expected)) {
    await db()`insert into admin_login_attempts default values`;
    await db()`delete from admin_login_attempts where created_at < now() - interval '1 day'`;
    await new Promise((r) => setTimeout(r, 600)); // slow down guessing
    return { error: "That password isn't right." };
  }

  await db()`delete from admin_login_attempts`;
  await startSession();
  redirect(adminPath());
}

export async function logout() {
  await endSession();
  redirect(adminPath("/login"));
}

export async function deletePasskey(id: string) {
  await requireAdmin();
  await db()`delete from admin_passkeys where id = ${id}`;
  revalidatePath("/admin/security");
}

/* ─── Helpers ───────────────────────────────────────────────────────────── */

async function logActivity(action: Activity["action"], slug: string, summary: string) {
  try {
    await db()`insert into activity_log (action, product_slug, summary) values (${action}, ${slug}, ${summary})`;
  } catch (e) {
    console.error("activity_log insert failed:", e);
  }
}

function refresh() {
  revalidateTag(PRODUCTS_TAG);
  revalidatePath("/admin", "layout");
}

function message(e: unknown) {
  return e instanceof Error ? e.message : String(e);
}

/* ─── Products ──────────────────────────────────────────────────────────── */

export type SaveState = { errors: ProductFieldErrors };

export async function saveProduct(_prev: SaveState, form: FormData): Promise<SaveState> {
  await requireAdmin();

  const mode = form.get("mode") === "edit" ? "edit" : "create";
  const { data, errors } = parseProductForm(form);
  if (!data) return { errors };

  if (!isAllowedImageUrl(data.image_url)) {
    return { errors: { imageUrl: "Upload the photo again; that image link isn't from our image library." } };
  }

  const sql = db();
  const d = data;
  let slug = d.slug;

  try {
    if (mode === "create") {
      await sql`
        insert into products (slug, name, category, price, original_price, description, details, delivery, sizes,
                              is_featured, is_bestseller, stock_quantity, image_url, sort_order)
        values (${d.slug}, ${d.name}, ${d.category}, ${d.price}, ${d.original_price}, ${d.description}, ${d.details},
                ${d.delivery}, ${d.sizes}, ${d.is_featured}, ${d.is_bestseller}, ${d.stock_quantity}, ${d.image_url},
                (select coalesce(max(sort_order), -1) + 1 from products))`;
      await logActivity("create", slug, `Added ${d.name} at ${cedis(d.price)} with ${d.stock_quantity} in stock`);
    } else {
      // The slug is the product's permanent ID (carts and wishlists reference it), so edits never change it.
      slug = String(form.get("originalSlug") ?? "");
      const [previous] = await sql`select image_url from products where slug = ${slug}`;
      const updated = await sql`
        update products set
          name = ${d.name}, category = ${d.category}, price = ${d.price}, original_price = ${d.original_price},
          description = ${d.description}, details = ${d.details}, delivery = ${d.delivery}, sizes = ${d.sizes},
          is_featured = ${d.is_featured}, is_bestseller = ${d.is_bestseller}, stock_quantity = ${d.stock_quantity},
          image_url = ${d.image_url}
        where slug = ${slug}
        returning slug`;
      if (!updated.length) return { errors: { form: "This product no longer exists. It may have been deleted." } };
      await logActivity("update", slug, `Edited ${d.name}`);
      // The photo was replaced: remove the old one from Cloudinary once the response is sent.
      if (previous?.image_url && previous.image_url !== d.image_url) after(() => deleteUploadedImage(previous.image_url));
    }
  } catch (e) {
    if ((e as { code?: string }).code === "23505") {
      return { errors: { slug: "Another product already uses this web address. Try a different one." } };
    }
    return { errors: { form: `Couldn't save: ${message(e)}` } };
  }

  refresh();
  redirect(adminPath(`/products?saved=${encodeURIComponent(slug)}`));
}

export async function deleteProduct(slug: string) {
  await requireAdmin();

  try {
    const rows = await db()`delete from products where slug = ${slug} returning name, image_url`;
    await logActivity("delete", slug, `Deleted ${rows[0]?.name ?? slug}`);
    if (rows[0]?.image_url) after(() => deleteUploadedImage(rows[0].image_url));
  } catch (e) {
    return { error: `Couldn't delete: ${message(e)}` };
  }
  refresh();
  return {};
}

export async function setStock(slug: string, quantity: number) {
  await requireAdmin();
  if (!Number.isInteger(quantity) || quantity < 0 || quantity > 100000) return { error: "Stock must be a whole number of 0 or more." };

  try {
    const rows = await db()`update products set stock_quantity = ${quantity} where slug = ${slug} returning name`;
    await logActivity("stock", slug, `Set ${rows[0]?.name ?? slug} stock to ${quantity}`);
  } catch (e) {
    return { error: `Couldn't update stock: ${message(e)}` };
  }
  refresh();
  return {};
}

const FLAGS = { is_featured: "New arrivals", is_bestseller: "Bestsellers" } as const;

export async function toggleFlag(slug: string, flag: keyof typeof FLAGS, value: boolean) {
  await requireAdmin();
  if (!(flag in FLAGS)) return { error: "Unknown setting." };

  try {
    const sql = db();
    const rows =
      flag === "is_featured"
        ? await sql`update products set is_featured = ${value} where slug = ${slug} returning name`
        : await sql`update products set is_bestseller = ${value} where slug = ${slug} returning name`;
    const name = rows[0]?.name ?? slug;
    await logActivity("flag", slug, `${value ? "Added" : "Removed"} ${name} ${value ? "to" : "from"} ${FLAGS[flag]}`);
  } catch (e) {
    return { error: `Couldn't update: ${message(e)}` };
  }
  refresh();
  return {};
}
