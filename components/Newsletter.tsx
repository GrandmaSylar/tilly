"use client";

import { useState, type FormEvent } from "react";
import { WhatsappLogo, Check } from "@phosphor-icons/react";
import { WHATSAPP_BUSINESS_NUMBER } from "@/lib/whatsapp";

export function Newsletter() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Add your name so we know who to message.");
      return;
    }
    setError("");
    const text = `Hi Tilly's Gallery, I'm ${name.trim()}. Please add me to your new arrivals list.`;
    window.open(`https://wa.me/${WHATSAPP_BUSINESS_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    setSent(true);
  }

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-brand px-5 py-12 text-center sm:px-10 sm:py-14">
      <div className="pointer-events-none absolute -bottom-48 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,oklch(77.33%_0.1736_160.47/0.25),transparent)]" />
      <div className="relative mx-auto max-w-xl">
        <h2 className="font-display text-2xl font-bold tracking-tight text-white uppercase sm:text-3xl">
          First to see what lands
        </h2>
        <p className="mt-3 text-white/75">
          New arrivals and restocks, sent on WhatsApp. One message when something good comes in, nothing more.
        </p>

        {sent ? (
          <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 font-medium text-white">
            <Check size={18} weight="bold" className="text-mint" />
            Send the WhatsApp message that just opened and you&apos;re on the list.
          </p>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-8">
            <div className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="nl-name" className="sr-only">
                Your name
              </label>
              <input
                id="nl-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                aria-invalid={!!error}
                aria-describedby={error ? "nl-error" : undefined}
                className="h-[52px] flex-1 rounded-full border border-white/15 bg-white/10 px-5 text-white placeholder:text-white/55 focus:border-mint focus:outline-none"
              />
              <button
                type="submit"
                className="press inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-mint px-6 font-semibold text-brand hover:brightness-105"
              >
                <WhatsappLogo size={20} weight="fill" />
                Join on WhatsApp
              </button>
            </div>
            {error && (
              <p id="nl-error" role="alert" className="mt-3 text-sm font-medium text-coral">
                {error}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
