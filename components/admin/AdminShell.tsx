"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChartBar, Package, PlusCircle, Storefront, SignOut } from "@phosphor-icons/react";
import { logout } from "@/app/admin/actions";

const NAV = [
  { href: "/admin", label: "Overview", icon: ChartBar },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/products/new", label: "Add product", icon: PlusCircle },
];

/** Products stays highlighted while editing one; "Add product" has its own tab. */
function isActive(pathname: string, href: string) {
  if (href === "/admin/products") return pathname.startsWith(href) && pathname !== "/admin/products/new";
  return pathname === href;
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[248px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-line bg-white/80 p-5 backdrop-blur lg:flex">
        <Link href="/admin" className="inline-flex">
          <Image src="/logo.png" alt="Tilly's Gallery" width={624} height={414} className="h-12 w-auto" />
        </Link>
        <p className="mt-2 text-xs font-bold tracking-[0.08em] text-slate uppercase">Store admin</p>
        <nav className="mt-8 flex flex-col gap-1" aria-label="Admin">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`press flex h-11 items-center gap-3 rounded-full px-4 font-semibold ${
                  active ? "bg-brand text-white" : "text-ink hover:bg-mist"
                }`}
              >
                <Icon size={20} weight={active ? "fill" : "regular"} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex flex-col gap-1 border-t border-line pt-4">
          <Link href="/" target="_blank" className="press flex h-11 items-center gap-3 rounded-full px-4 font-semibold text-ink hover:bg-mist">
            <Storefront size={20} /> View store
          </Link>
          <form action={logout}>
            <button type="submit" className="press flex h-11 w-full items-center gap-3 rounded-full px-4 font-semibold text-ink hover:bg-mist">
              <SignOut size={20} /> Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-white/90 px-4 backdrop-blur lg:hidden">
        <Link href="/admin" className="inline-flex items-center gap-2">
          <Image src="/logo.png" alt="Tilly's Gallery" width={624} height={414} className="h-10 w-auto" />
          <span className="text-xs font-bold tracking-[0.08em] text-slate uppercase">Admin</span>
        </Link>
        <div className="flex items-center">
          <Link href="/" target="_blank" aria-label="View store" className="press grid size-11 place-items-center rounded-full text-brand hover:bg-mist">
            <Storefront size={22} />
          </Link>
          <form action={logout}>
            <button type="submit" aria-label="Sign out" className="press grid size-11 place-items-center rounded-full text-brand hover:bg-mist">
              <SignOut size={22} />
            </button>
          </form>
        </div>
      </header>

      <main className="min-w-0 px-4 pt-6 pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:px-6 lg:px-10 lg:pt-10 lg:pb-16">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>

      {/* Mobile bottom tabs */}
      <nav
        aria-label="Admin"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`press flex min-h-16 flex-col items-center justify-center gap-0.5 text-[13px] font-semibold ${
                active ? "text-brand" : "text-slate"
              }`}
            >
              <Icon size={24} weight={active ? "fill" : "regular"} />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
