"use client";

import { useEffect, useState } from "react";
import { WhatsappLogo } from "@phosphor-icons/react";
import { WHATSAPP_BUSINESS_NUMBER } from "@/lib/whatsapp";

export function WhatsAppFloat() {
  // On small screens the button tucks away while scrolling down so it never sits on top of prices or Add buttons
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (Math.abs(y - lastY) > 6) {
          setHidden(y > lastY && y > 120);
          lastY = y;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <a
      href={`https://wa.me/${WHATSAPP_BUSINESS_NUMBER}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Tilly's Gallery on WhatsApp"
      className={`press fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 grid size-13 place-items-center rounded-full bg-mint text-brand shadow-[0_12px_28px_-8px_oklch(62%_0.15_160.47/0.7)] transition-[transform,opacity] duration-300 ease-[var(--ease-out)] sm:right-6 sm:bottom-6 sm:size-14 ${
        hidden ? "max-sm:pointer-events-none max-sm:translate-y-24 max-sm:opacity-0" : ""
      }`}
    >
      <WhatsappLogo size={26} weight="fill" />
    </a>
  );
}
