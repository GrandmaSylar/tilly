"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Fingerprint, Trash } from "@phosphor-icons/react";
import { startRegistration } from "@simplewebauthn/browser";
import { deletePasskey } from "@/app/admin/actions";
import { useAdminHref } from "@/components/admin/AdminBase";
import { dangerButton, primaryButton } from "@/components/admin/ui";

export type PasskeyRow = { id: string; label: string; createdAt: string; lastUsedAt: string | null };

const date = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

function deviceName() {
  const ua = navigator.userAgent;
  if (/iPhone/.test(ua)) return "iPhone";
  if (/iPad/.test(ua)) return "iPad";
  if (/Android/.test(ua)) return "Android phone";
  if (/Mac/.test(ua)) return "Mac";
  if (/Windows/.test(ua)) return "Windows PC";
  return "This device";
}

export function PasskeyManager({ passkeys }: { passkeys: PasskeyRow[] }) {
  const { href } = useAdminHref();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  async function addPasskey() {
    setMessage(null);
    setBusy(true);
    try {
      const optionsRes = await fetch(href("/api/passkey/register-options"), { method: "POST" });
      if (!optionsRes.ok) throw new Error("Couldn't start passkey setup. Sign in again and retry.");
      const response = await startRegistration({ optionsJSON: await optionsRes.json() });

      const verifyRes = await fetch(href("/api/passkey/register-verify"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response, label: deviceName() }),
      });
      if (!verifyRes.ok) throw new Error((await verifyRes.json()).error ?? "Couldn't save the passkey.");
      setMessage({ tone: "ok", text: "Passkey added. You can now sign in with it." });
      router.refresh();
    } catch (e) {
      const cancelled = e instanceof Error && (e.name === "NotAllowedError" || e.name === "InvalidStateError");
      setMessage({
        tone: "error",
        text: cancelled ? "Setup was cancelled, or this device already has a passkey." : e instanceof Error ? e.message : "Passkey setup failed.",
      });
    } finally {
      setBusy(false);
    }
  }

  function remove(id: string) {
    startTransition(async () => {
      await deletePasskey(id);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {passkeys.length === 0 ? (
        <p className="text-slate">No passkeys yet. Add one on this device to sign in with Face ID, a fingerprint or your device PIN.</p>
      ) : (
        <ul className="divide-y divide-line">
          {passkeys.map((p) => (
            <li key={p.id} className="flex items-center gap-3 py-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-mist text-brand">
                <Fingerprint size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">{p.label}</p>
                <p className="text-sm text-slate">
                  Added {date(p.createdAt)} · {p.lastUsedAt ? `last used ${date(p.lastUsedAt)}` : "not used yet"}
                </p>
              </div>
              <button type="button" onClick={() => remove(p.id)} disabled={pending} aria-label={`Remove ${p.label}`} className={`${dangerButton} !px-3`}>
                <Trash size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div>
        <button type="button" onClick={addPasskey} disabled={busy} className={primaryButton}>
          <Fingerprint size={20} weight="bold" />
          {busy ? "Waiting for your device…" : "Add a passkey on this device"}
        </button>
      </div>

      {message && (
        <p role="status" className={`text-sm font-medium ${message.tone === "ok" ? "text-brand" : "text-danger"}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}
