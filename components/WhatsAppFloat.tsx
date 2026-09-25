import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { WHATSAPP_BUSINESS_NUMBER } from "@/lib/whatsapp";

export function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_BUSINESS_NUMBER}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Tilly's Gallery on WhatsApp"
      className="press fixed right-4 bottom-4 z-30 grid size-14 place-items-center rounded-full bg-mint text-brand shadow-[0_12px_28px_-8px_oklch(62%_0.15_160.47/0.7)] sm:right-6 sm:bottom-6"
    >
      <WhatsappLogo size={28} weight="fill" />
    </a>
  );
}
