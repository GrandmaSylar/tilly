import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CartDrawer } from "@/components/CartDrawer";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

/** Announcement bar, header, footer, cart and WhatsApp button shared by every storefront page. */
export function StoreChrome({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        <div className="bg-brand text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-4 px-4 py-2 sm:justify-between sm:px-6">
            <p className="font-display text-xs font-bold tracking-[0.06em] uppercase">
              Same-day delivery across Greater Accra
            </p>
            <p className="hidden text-[11px] font-semibold uppercase tracking-[0.06em] text-sand sm:block">
              48 hours anywhere in Ghana
            </p>
          </div>
        </div>
        <Navbar />
        {children}
        <Footer />
        <CartDrawer />
        <WhatsAppFloat />
      </WishlistProvider>
    </CartProvider>
  );
}
