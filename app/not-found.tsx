import Link from "next/link";
import { Container } from "@/components/Section";

export default function NotFound() {
  return (
    <main>
      <Container className="flex flex-col items-center py-24 text-center">
        <p className="font-display text-7xl font-bold tracking-tighter text-mint-deep">404</p>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink">This page has moved on</h1>
        <p className="mt-2 max-w-sm text-slate">It may have sold out or never existed. Everything that&apos;s still available is in the shop.</p>
        <Link href="/shop" className="press mt-8 inline-flex h-12 items-center rounded-full bg-brand px-7 font-semibold text-white uppercase">
          Shop now
        </Link>
      </Container>
    </main>
  );
}
