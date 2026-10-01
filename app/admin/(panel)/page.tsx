import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { DownloadSimple, Plus } from "@phosphor-icons/react/dist/ssr";
import { fetchActivity, fetchProducts, fetchStorageUsage, type Activity } from "@/lib/catalog";
import { isLowStock, isSoldOut, productImageSrc } from "@/lib/products";
import { cedis } from "@/lib/format";
import { Card, PageTitle, primaryButton, secondaryButton } from "@/components/admin/ui";
import { StorageWidget } from "@/components/admin/StorageWidget";

export const metadata: Metadata = { title: "Overview" };

const ACTION_LABEL: Record<Activity["action"], string> = {
  create: "Added",
  update: "Edited",
  delete: "Deleted",
  stock: "Stock",
  flag: "Home page",
};

const timeFormat = new Intl.DateTimeFormat("en-GH", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Accra" });

export default async function AdminOverview() {
  const [products, activity, storage] = await Promise.all([
    fetchProducts(),
    fetchActivity(10),
    fetchStorageUsage().catch((e) => {
      console.error("storage usage query failed:", e);
      return null;
    }),
  ]);

  const units = products.reduce((sum, p) => sum + p.stockQuantity, 0);
  const value = products.reduce((sum, p) => sum + p.price * p.stockQuantity, 0);
  const low = products.filter(isLowStock);
  const soldOut = products.filter(isSoldOut);
  const attention = [...soldOut, ...low.sort((a, b) => a.stockQuantity - b.stockQuantity)];

  const kpis = [
    { label: "Products", value: String(products.length), note: `${units} units in stock` },
    { label: "Stock value", value: cedis(value), note: "Price × units on hand" },
    { label: "Low stock", value: String(low.length), note: "Under 10 left", href: "/admin/products?stock=low", tone: low.length ? "text-coral-deep" : "" },
    { label: "Sold out", value: String(soldOut.length), note: "Hidden from bundles", href: "/admin/products?stock=out", tone: soldOut.length ? "text-danger" : "" },
    { label: "New arrivals", value: String(products.filter((p) => p.isFeatured).length), note: "Featured on the home page" },
    { label: "Bestsellers", value: String(products.filter((p) => p.isBestseller).length), note: "Shown in the Bestsellers row" },
  ];

  return (
    <>
      <PageTitle
        title="Overview"
        subtitle="How the catalogue is doing right now."
        action={
          <Link href="/admin/products/new" className={primaryButton}>
            <Plus size={18} weight="bold" /> Add product
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 [&>*]:min-w-0">
        {kpis.map((k) => {
          const body = (
            <>
              <p className="text-[13px] font-semibold tracking-wide text-slate uppercase">{k.label}</p>
              <p className={`tabular mt-1 font-display text-[clamp(1.35rem,1rem+1.5vw,2rem)] leading-tight font-bold tracking-tight break-words text-ink ${k.tone ?? ""}`}>
                {k.value}
              </p>
              <p className="mt-1 text-[13px] text-slate">{k.note}</p>
            </>
          );
          return k.href ? (
            <Link key={k.label} href={k.href} className="press rounded-[1.25rem] border border-line bg-white p-4 hover:border-slate/40 sm:p-5">
              {body}
            </Link>
          ) : (
            <Card key={k.label}>{body}</Card>
          );
        })}
      </div>

      <div className="mt-8">
        <StorageWidget usage={storage} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 [&>*]:min-w-0">
        <Card>
          <h2 className="font-display text-lg font-bold tracking-tight text-ink">Needs restocking</h2>
          {attention.length === 0 ? (
            <p className="mt-3 text-slate">Everything has 10 or more in stock.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line">
              {attention.slice(0, 8).map((p) => (
                <li key={p.slug}>
                  <Link href={`/admin/products/${p.slug}`} className="press -mx-2 flex min-h-14 items-center gap-3 rounded-xl px-2 py-2 hover:bg-mist">
                    <span className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-ice">
                      <Image src={productImageSrc(p, 120)} alt="" fill sizes="44px" className="object-cover" />
                    </span>
                    <span className="min-w-0 flex-1 truncate font-semibold text-ink">{p.name}</span>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[13px] font-bold ${
                        isSoldOut(p) ? "bg-danger/10 text-danger" : "bg-coral/15 text-coral-deep"
                      }`}
                    >
                      {isSoldOut(p) ? "Sold out" : `${p.stockQuantity} left`}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="font-display text-lg font-bold tracking-tight text-ink">Recent activity</h2>
          {activity.length === 0 ? (
            <p className="mt-3 text-slate">Changes you make will be listed here.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line">
              {activity.map((a) => (
                <li key={a.id} className="flex items-start gap-3 py-2.5">
                  <span className="mt-0.5 w-[5.75rem] shrink-0 rounded-full bg-mist px-2 py-0.5 text-center text-[12px] font-bold whitespace-nowrap text-mint-deep uppercase">
                    {ACTION_LABEL[a.action]}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] text-ink sm:text-sm">{a.summary}</span>
                    <span className="block text-[13px] text-slate">{timeFormat.format(new Date(a.created_at))}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight text-ink">Export catalogue</h2>
          <p className="text-[15px] text-slate sm:text-sm">Download every product as a spreadsheet or a JSON backup.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="/api/admin/export?format=csv" className={secondaryButton}>
            <DownloadSimple size={18} /> CSV
          </a>
          <a href="/api/admin/export?format=json" className={secondaryButton}>
            <DownloadSimple size={18} /> JSON
          </a>
        </div>
      </Card>
    </>
  );
}
