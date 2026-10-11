import type { Metadata } from "next";
import { PasskeyManager } from "@/components/admin/PasskeyManager";
import { Card, PageTitle } from "@/components/admin/ui";
import { listPasskeys } from "@/lib/passkeys";

export const metadata: Metadata = { title: "Security" };
export const dynamic = "force-dynamic";

export default async function SecurityPage() {
  const passkeys = await listPasskeys();

  return (
    <>
      <PageTitle title="Security" subtitle="Sign in with your device instead of typing a password." />
      <div className="flex max-w-2xl flex-col gap-4 [&>*]:min-w-0">
        <Card className="p-5 sm:p-6">
          <h2 className="font-display text-lg font-bold text-ink">Passkeys</h2>
          <p className="mt-1 mb-4 text-slate">
            Add a passkey on each phone or computer you use for the dashboard. Passkeys only work on this website&apos;s address, so add them again if the
            address ever changes.
          </p>
          <PasskeyManager passkeys={passkeys.map(({ id, label, createdAt, lastUsedAt }) => ({ id, label, createdAt, lastUsedAt }))} />
        </Card>
        <Card className="p-5 sm:p-6">
          <h2 className="font-display text-lg font-bold text-ink">How sign-in is protected</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-slate">
            <li>The dashboard lives at a private address that isn&apos;t linked anywhere on the store.</li>
            <li>After 5 wrong passwords, password sign-in locks for 15 minutes. Passkeys keep working.</li>
            <li>You&apos;re signed out after 7 days without visiting, and always after 30 days.</li>
          </ul>
        </Card>
      </div>
    </>
  );
}
