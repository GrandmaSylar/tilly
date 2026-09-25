"use client";

import { useEffect, useState, type FormEvent } from "react";
import { X, WhatsappLogo, LockSimple } from "@phosphor-icons/react";
import { useCart } from "@/context/CartContext";
import { cedis } from "@/lib/format";
import { generateOrderReference, buildWhatsAppCheckoutUrl, type OrderCustomerDetails } from "@/lib/whatsapp";

const PAYMENT_METHODS: OrderCustomerDetails["paymentMethod"][] = ["MTN MoMo", "Telecel Cash", "Bank Transfer", "Cash on Delivery"];

type Errors = Partial<Record<"fullName" | "phone" | "deliveryLocation", string>>;

export function WhatsAppCheckoutModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { items, itemCount, subtotal, clearCart } = useCart();
  const [orderRef] = useState(() => generateOrderReference());
  const [errors, setErrors] = useState<Errors>({});
  const [formData, setFormData] = useState<OrderCustomerDetails>({
    fullName: "",
    phone: "",
    deliveryLocation: "",
    paymentMethod: "MTN MoMo",
    notes: "",
  });

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function set<K extends keyof OrderCustomerDetails>(key: K, value: OrderCustomerDetails[K]) {
    setFormData((d) => ({ ...d, [key]: value }));
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (!formData.fullName.trim()) next.fullName = "Enter the name for this order.";
    if (formData.phone.replace(/\D/g, "").length < 9) next.phone = "Enter a phone number we can reach on WhatsApp, e.g. 024 123 4567.";
    if (!formData.deliveryLocation.trim()) next.deliveryLocation = "Add an area and a landmark so the rider can find you.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const whatsappUrl = buildWhatsAppCheckoutUrl(orderRef, formData, items, subtotal);
    try {
      localStorage.setItem(
        "tilly_last_order",
        JSON.stringify({ orderRef, customer: formData, items, subtotal, date: new Date().toISOString() })
      );
    } catch {}
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    clearCart();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[60] flex justify-center overflow-y-auto bg-brand/50 transition-opacity duration-200 starting:opacity-0 sm:p-4">
      <div className="fixed inset-0" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        className="relative mt-auto w-full max-w-lg rounded-t-[1.75rem] bg-white px-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_32px_64px_-24px_oklch(30%_0.03_45/0.5)] transition-[opacity,transform] duration-[260ms] ease-[var(--ease-out)] starting:translate-y-4 starting:opacity-0 sm:my-auto sm:rounded-[1.75rem] sm:p-7 sm:starting:translate-y-0 sm:starting:scale-[0.96]"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="checkout-title" className="font-display text-[1.4rem] font-bold tracking-tight text-ink sm:text-2xl">
              Finish your order
            </h2>
            <p className="mt-1 text-[15px] text-slate sm:text-sm">
              We&apos;ll confirm stock and payment on WhatsApp. Order{" "}
              <span className="tabular font-semibold whitespace-nowrap text-ink">{orderRef}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="press -mt-1.5 -mr-2 grid size-11 shrink-0 place-items-center rounded-full text-brand hover:bg-mist"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
          <Field id="co-name" label="Full name" error={errors.fullName}>
            <input
              id="co-name"
              autoComplete="name"
              placeholder="Ama Owusu"
              value={formData.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? "co-name-error" : undefined}
              className={inputClass(!!errors.fullName)}
            />
          </Field>
          <Field id="co-phone" label="Phone / WhatsApp number" error={errors.phone}>
            <input
              id="co-phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="024 123 4567"
              value={formData.phone}
              onChange={(e) => set("phone", e.target.value)}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "co-phone-error" : undefined}
              className={inputClass(!!errors.phone)}
            />
          </Field>
          <Field id="co-address" label="Delivery area and landmark" error={errors.deliveryLocation}>
            <input
              id="co-address"
              autoComplete="street-address"
              placeholder="East Legon, near A&C Mall"
              value={formData.deliveryLocation}
              onChange={(e) => set("deliveryLocation", e.target.value)}
              aria-invalid={!!errors.deliveryLocation}
              aria-describedby={errors.deliveryLocation ? "co-address-error" : undefined}
              className={inputClass(!!errors.deliveryLocation)}
            />
          </Field>

          <fieldset>
            <legend className="text-[15px] font-semibold text-ink sm:text-sm">How you&apos;ll pay</legend>
            <div className="mt-2 grid grid-cols-1 gap-2 min-[360px]:grid-cols-2">
              {PAYMENT_METHODS.map((method) => {
                const active = formData.paymentMethod === method;
                return (
                  <button
                    key={method}
                    type="button"
                    onClick={() => set("paymentMethod", method)}
                    aria-pressed={active}
                    className={`press h-12 rounded-full border px-2 text-[15px] font-semibold sm:h-11 sm:text-sm ${
                      active ? "border-brand bg-brand text-white" : "border-line bg-white text-ink hover:border-slate/50"
                    }`}
                  >
                    {method}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <Field id="co-notes" label="Notes (optional)">
            <textarea
              id="co-notes"
              rows={2}
              placeholder="Gift wrap it, deliver after 3 PM…"
              value={formData.notes}
              onChange={(e) => set("notes", e.target.value)}
              className="w-full resize-none rounded-2xl border border-line bg-mist px-4 py-3 text-ink placeholder:text-slate/80 focus:border-brand focus:bg-white focus:outline-none"
            />
          </Field>

          <div className="flex items-baseline justify-between border-t border-line pt-4">
            <span className="text-sm text-slate">
              Total · {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
            <span className="tabular font-display text-2xl font-bold tracking-tight text-ink">{cedis(subtotal)}</span>
          </div>

          <button
            type="submit"
            className="press flex h-[52px] items-center justify-center gap-2 rounded-full bg-mint font-semibold text-ink hover:brightness-105"
          >
            <WhatsappLogo size={20} weight="fill" />
            Send order on WhatsApp
          </button>
          <p className="-mt-1 flex items-center justify-center gap-1.5 text-xs text-slate">
            <LockSimple size={12} /> Nothing is charged here. You pay after we confirm.
          </p>
        </form>
      </div>
    </div>
  );
}

function inputClass(invalid: boolean) {
  return `h-12 w-full rounded-full border bg-mist px-5 text-ink placeholder:text-slate/80 focus:bg-white focus:outline-none ${
    invalid ? "border-danger focus:border-danger" : "border-line focus:border-brand"
  }`;
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[15px] font-semibold text-ink sm:text-sm">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-[15px] text-danger sm:text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
