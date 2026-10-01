import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { template: "%s · Tilly admin", default: "Tilly admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
