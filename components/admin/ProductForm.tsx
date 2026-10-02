"use client";

import { startTransition, useActionState, useState } from "react";
import Link from "next/link";
import { X } from "@phosphor-icons/react";
import { saveProduct, type SaveState } from "@/app/admin/actions";
import { CATEGORIES, type Product } from "@/lib/products";
import { cedis, discountPercent } from "@/lib/format";
import { slugify } from "@/lib/product-input";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Card, Field, inputClass, primaryButton, secondaryButton, textareaClass } from "@/components/admin/ui";

const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const SHOE_SIZES = ["36", "37", "38", "39", "40", "41", "42", "43"];
const FOOTWEAR = ["Heels", "Slippers"];

export function ProductForm({ product }: { product?: Product }) {
  const editing = !!product;
  const [state, action, pending] = useActionState<SaveState, FormData>(saveProduct, { errors: {} });
  const errors = state.errors;

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(editing);
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [originalPrice, setOriginalPrice] = useState(product?.originalPrice ? String(product.originalPrice) : "");
  const [category, setCategory] = useState<string>(product?.category ?? "");
  const [sizes, setSizes] = useState<string[]>(product?.sizes ?? []);
  const SIZE_PRESETS = FOOTWEAR.includes(category) ? SHOE_SIZES : CLOTHING_SIZES;
  const [sizeDraft, setSizeDraft] = useState("");

  const off = discountPercent(Number(price) || 0, Number(originalPrice) || undefined);

  function addSize(value: string) {
    const v = value.trim();
    if (v && !sizes.includes(v)) setSizes([...sizes, v]);
    setSizeDraft("");
  }

  return (
    <form
      // Submitting via onSubmit (not the form action prop) stops React from resetting the fields when validation fails.
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => action(data));
      }}
      noValidate
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
      <input type="hidden" name="mode" value={editing ? "edit" : "create"} />
      {editing && <input type="hidden" name="originalSlug" value={product.slug} />}
      <input type="hidden" name="sizes" value={sizes.join(",")} />

      <div className="flex min-w-0 flex-col gap-6">
        {errors.form && (
          <div role="alert" className="rounded-2xl border border-danger/40 bg-danger/5 px-4 py-3 text-danger">
            {errors.form}
          </div>
        )}

        <Card className="flex flex-col gap-4">
          <h2 className="font-display text-lg font-bold tracking-tight text-ink">Basics</h2>
          <Field id="name" label="Name" error={errors.name}>
            <input
              id="name"
              name="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              required
              maxLength={120}
              placeholder="e.g. Labadi Coast Eau de Parfum"
              aria-invalid={!!errors.name}
              className={inputClass(!!errors.name)}
            />
          </Field>
          <Field
            id="slug"
            label="Web address"
            hint={editing ? "Fixed after creation so saved carts and wishlists keep working." : `tilly-beige.vercel.app/shop/${slug || "…"}`}
            error={errors.slug}
          >
            <input
              id="slug"
              name="slug"
              value={slug}
              readOnly={editing}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
              required
              aria-invalid={!!errors.slug}
              className={inputClass(!!errors.slug, editing ? "text-slate" : "")}
            />
          </Field>
          <Field id="category" label="Category" error={errors.category}>
            <select id="category" name="category" value={category} onChange={(e) => setCategory(e.target.value)} required aria-invalid={!!errors.category} className={inputClass(!!errors.category)}>
              <option value="" disabled>
                Choose a category
              </option>
              {CATEGORIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
        </Card>

        <Card className="flex flex-col gap-4">
          <h2 className="font-display text-lg font-bold tracking-tight text-ink">Price</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="price" label="Price (GH₵)" error={errors.price}>
              <input
                id="price"
                name="price"
                inputMode="numeric"
                value={price}
                onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ""))}
                required
                placeholder="1850"
                aria-invalid={!!errors.price}
                className={inputClass(!!errors.price, "tabular")}
              />
            </Field>
            <Field id="originalPrice" label="Was (GH₵), optional" hint="Fill in to show it as a deal." error={errors.originalPrice}>
              <input
                id="originalPrice"
                name="originalPrice"
                inputMode="numeric"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value.replace(/[^\d]/g, ""))}
                placeholder="2100"
                aria-invalid={!!errors.originalPrice}
                className={inputClass(!!errors.originalPrice, "tabular")}
              />
            </Field>
          </div>
          {off > 0 && (
            <p className="w-fit rounded-full bg-coral/15 px-3 py-1 text-[14px] font-semibold text-coral-deep">
              Shows as {off}% off · save {cedis(Number(originalPrice) - Number(price))}
            </p>
          )}
        </Card>

        <Card className="flex flex-col gap-4">
          <h2 className="font-display text-lg font-bold tracking-tight text-ink">Description</h2>
          <Field id="description" label="Description" error={errors.description}>
            <textarea id="description" name="description" rows={4} defaultValue={product?.description} required aria-invalid={!!errors.description} className={textareaClass(!!errors.description)} />
          </Field>
          <Field id="details" label="Details" hint="Materials, size, care. Shown under the product name.">
            <textarea id="details" name="details" rows={2} defaultValue={product?.details} className={textareaClass()} />
          </Field>
          <Field id="delivery" label="Delivery note">
            <textarea
              id="delivery"
              name="delivery"
              rows={2}
              defaultValue={product?.delivery ?? "Same-day delivery in Greater Accra. 48-hour delivery across Ghana."}
              className={textareaClass()}
            />
          </Field>
        </Card>

        <Card className="flex flex-col gap-3">
          <div>
            <h2 className="font-display text-lg font-bold tracking-tight text-ink">Sizes</h2>
            <p className="text-[15px] text-slate sm:text-sm">
              {FOOTWEAR.includes(category) ? "EU shoe sizes. Add half sizes or UK sizes below if you need them." : "Leave empty for one-size items like perfume or bags."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {SIZE_PRESETS.map((s) => {
              const on = sizes.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setSizes(on ? sizes.filter((x) => x !== s) : [...sizes, s])}
                  className={`press h-11 min-w-12 rounded-full border px-4 font-semibold ${on ? "border-brand bg-brand text-white" : "border-line bg-white text-ink hover:border-slate/50"}`}
                >
                  {s}
                </button>
              );
            })}
          </div>
          {sizes.filter((s) => !SIZE_PRESETS.includes(s)).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {sizes
                .filter((s) => !SIZE_PRESETS.includes(s))
                .map((s) => (
                  <span key={s} className="inline-flex h-11 items-center gap-1 rounded-full bg-brand pr-1 pl-4 font-semibold text-white">
                    {s}
                    <button type="button" aria-label={`Remove size ${s}`} onClick={() => setSizes(sizes.filter((x) => x !== s))} className="press grid size-9 place-items-center rounded-full hover:bg-white/15">
                      <X size={14} weight="bold" />
                    </button>
                  </span>
                ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              aria-label="Custom size"
              value={sizeDraft}
              onChange={(e) => setSizeDraft(e.target.value.replace(/,/g, ""))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSize(sizeDraft);
                }
              }}
              placeholder="Custom size, e.g. 38 or 100ml"
              className={inputClass()}
            />
            <button type="button" onClick={() => addSize(sizeDraft)} className={`${secondaryButton} shrink-0`}>
              Add
            </button>
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-6 lg:sticky lg:top-10">
        <Card className="flex flex-col gap-3">
          <h2 className="font-display text-lg font-bold tracking-tight text-ink">Photo</h2>
          <ImageUpload name="imageUrl" defaultValue={product?.imageUrl} error={errors.imageUrl} />
        </Card>

        <Card className="flex flex-col gap-4">
          <h2 className="font-display text-lg font-bold tracking-tight text-ink">Stock & home page</h2>
          <Field id="stockQuantity" label="Units in stock" hint="Under 10 shows “Only X left”. 0 shows “Sold out”." error={errors.stockQuantity}>
            <input
              id="stockQuantity"
              name="stockQuantity"
              inputMode="numeric"
              defaultValue={product?.stockQuantity ?? 0}
              onChange={(e) => (e.target.value = e.target.value.replace(/[^\d]/g, ""))}
              required
              aria-invalid={!!errors.stockQuantity}
              className={inputClass(!!errors.stockQuantity, "tabular")}
            />
          </Field>
          <Checkbox name="isFeatured" label="Show in New arrivals" defaultChecked={product?.isFeatured} />
          <Checkbox name="isBestseller" label="Show in Bestsellers" defaultChecked={product?.isBestseller} />
        </Card>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          <button type="submit" disabled={pending} className={primaryButton}>
            {pending ? "Saving…" : editing ? "Save changes" : "Add product"}
          </button>
          <Link href="/admin/products" className={secondaryButton}>
            Cancel
          </Link>
          {editing && (
            <Link href={`/shop/${product.slug}`} target="_blank" className="press inline-flex min-h-11 items-center justify-center text-[15px] font-semibold text-mint-deep hover:underline sm:col-span-2 lg:col-span-1">
              View on store ↗
            </Link>
          )}
        </div>
      </div>
    </form>
  );
}

function Checkbox({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[15px] font-semibold text-ink">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="size-5 accent-[var(--color-brand)]" />
      {label}
    </label>
  );
}
