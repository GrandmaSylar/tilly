import type { ReactNode } from "react";

/** Same field styling as the WhatsApp checkout form; 16px text so iOS doesn't zoom. */
export function inputClass(invalid = false, extra = "") {
  return `h-12 w-full rounded-full border bg-mist px-5 text-base text-ink placeholder:text-slate/80 focus:bg-white focus:outline-none ${
    invalid ? "border-danger focus:border-danger" : "border-line focus:border-brand"
  } ${extra}`;
}

export function textareaClass(invalid = false) {
  return `w-full resize-y rounded-2xl border bg-mist px-4 py-3 text-base text-ink placeholder:text-slate/80 focus:bg-white focus:outline-none ${
    invalid ? "border-danger focus:border-danger" : "border-line focus:border-brand"
  }`;
}

export function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="text-[15px] font-semibold text-ink sm:text-sm">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-[13px] text-slate">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-[15px] text-danger sm:text-sm">
          {error}
        </p>
      )}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[1.25rem] border border-line bg-white p-4 sm:p-5 ${className}`}>{children}</div>;
}

export function PageTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="font-display text-[clamp(1.5rem,1.1rem+1.6vw,2rem)] leading-tight font-bold tracking-tight text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-slate">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export const primaryButton =
  "press inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-6 font-semibold text-white hover:bg-brand-soft disabled:pointer-events-none disabled:opacity-50";

export const secondaryButton =
  "press inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line bg-white px-5 font-semibold text-ink hover:border-slate/50 disabled:pointer-events-none disabled:opacity-50";

export const dangerButton =
  "press inline-flex h-12 items-center justify-center gap-2 rounded-full bg-danger px-6 font-semibold text-white hover:brightness-110 disabled:pointer-events-none disabled:opacity-50";
