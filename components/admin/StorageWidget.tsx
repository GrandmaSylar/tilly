import { Database } from "@phosphor-icons/react/dist/ssr";
import type { StorageUsage } from "@/lib/catalog";
import { Card } from "@/components/admin/ui";

const KB = 1024;
const MB = KB * 1024;
const GB = MB * 1024;

function formatBytes(bytes: number) {
  if (bytes >= GB) return `${(bytes / GB).toFixed(2)} GB`;
  if (bytes >= MB) return `${(bytes / MB).toFixed(1)} MB`;
  if (bytes >= KB) return `${(bytes / KB).toFixed(0)} KB`;
  return `${bytes} bytes`;
}

const number = new Intl.NumberFormat("en-GH");

/** Rounds big estimates down to a friendly figure so they don't read as falsely precise. */
function roughly(n: number) {
  if (n >= 100_000) return number.format(Math.floor(n / 10_000) * 10_000);
  if (n >= 10_000) return number.format(Math.floor(n / 1_000) * 1_000);
  if (n >= 1_000) return number.format(Math.floor(n / 100) * 100);
  return number.format(Math.max(0, Math.floor(n)));
}

export function StorageWidget({ usage }: { usage: StorageUsage | null }) {
  if (!usage) {
    return (
      <Card>
        <Header />
        <p className="mt-3 text-slate">Couldn&apos;t read storage from Neon right now. Refresh to try again.</p>
      </Card>
    );
  }

  const left = Math.max(0, usage.limit - usage.used);
  const usedPct = Math.min(100, (usage.used / usage.limit) * 100);
  const moreProducts = left / usage.bytesPerProduct;
  const state = usedPct >= 90 ? "full" : usedPct >= 75 ? "filling" : "ok";

  const segments = [
    { label: "Products", bytes: usage.products, className: "bg-brand" },
    { label: "Activity log", bytes: usage.activity, className: "bg-mint" },
    { label: "Database system files", bytes: usage.system, className: "bg-slate/40" },
  ];

  return (
    <Card>
      <Header />

      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="tabular font-display text-[clamp(1.5rem,1.1rem+1.6vw,2rem)] leading-tight font-bold tracking-tight text-ink">
          {formatBytes(left)} <span className="text-base font-semibold text-slate">left</span>
        </p>
        <p className="tabular text-[15px] text-slate sm:text-sm">
          {formatBytes(usage.used)} of {formatBytes(usage.limit)} used ({usedPct < 1 ? usedPct.toFixed(1) : Math.round(usedPct)}%)
        </p>
      </div>
      <p className="tabular mt-0.5 text-[13px] text-slate">Exactly {number.format(left)} bytes free</p>

      <div
        role="meter"
        aria-label="Database storage used"
        aria-valuemin={0}
        aria-valuemax={usage.limit}
        aria-valuenow={usage.used}
        aria-valuetext={`${formatBytes(usage.used)} of ${formatBytes(usage.limit)} used`}
        className="mt-4 flex h-3 overflow-hidden rounded-full bg-mist ring-1 ring-line"
      >
        {segments.map((s) => (
          <span
            key={s.label}
            className={s.className}
            // Keep tiny but non-zero segments visible.
            style={{ width: `${s.bytes > 0 ? Math.max(0.6, (s.bytes / usage.limit) * 100) : 0}%` }}
          />
        ))}
      </div>

      <ul className="mt-3 grid gap-1.5 text-[15px] sm:grid-cols-3 sm:text-sm">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <span className={`size-2.5 shrink-0 rounded-full ${s.className}`} />
            <span className="min-w-0 truncate text-slate">{s.label}</span>
            <span className="tabular ml-auto font-semibold text-ink sm:ml-0">{formatBytes(s.bytes)}</span>
          </li>
        ))}
      </ul>

      <div
        className={`mt-4 rounded-2xl px-4 py-3 text-[15px] sm:text-sm ${
          state === "full" ? "bg-danger/10 text-danger" : state === "filling" ? "bg-coral/15 text-coral-deep" : "bg-mist text-ink"
        }`}
      >
        {state === "full" ? (
          <p>
            <strong>Almost full.</strong> Clear old activity or upgrade your Neon plan soon, or new products won&apos;t save.
          </p>
        ) : (
          <p>
            Room for <strong>about {roughly(moreProducts)} more products</strong> at your current average of {formatBytes(usage.bytesPerProduct)} each
            {state === "filling" ? ". Storage is filling up, so keep an eye on it." : "."}
          </p>
        )}
      </div>
      <p className="mt-3 text-[13px] text-slate">
        Photos are stored on Cloudinary and don&apos;t count towards this. The {formatBytes(usage.system)} of system files is Postgres&apos;s own
        baseline and stays roughly the same as you add products.
      </p>
    </Card>
  );
}

function Header() {
  return (
    <div className="flex items-center gap-2">
      <span className="grid size-9 place-items-center rounded-full bg-mist text-brand">
        <Database size={18} weight="bold" />
      </span>
      <div>
        <h2 className="font-display text-lg leading-tight font-bold tracking-tight text-ink">Database storage</h2>
        <p className="text-[13px] text-slate">Neon free plan</p>
      </div>
    </div>
  );
}
