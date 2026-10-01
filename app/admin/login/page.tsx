import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm rounded-[1.75rem] border border-line bg-white p-6 shadow-[0_32px_64px_-32px_oklch(30%_0.03_45/0.45)] sm:p-8">
        <Image src="/logo.png" alt="Tilly's Gallery" width={624} height={414} priority className="mx-auto h-14 w-auto" />
        <h1 className="mt-6 text-center font-display text-2xl font-bold tracking-tight text-ink">Store admin</h1>
        <p className="mt-1 text-center text-slate">Sign in to manage products and stock.</p>
        <LoginForm />
      </div>
    </main>
  );
}
