"use client";

import { useActionState, useState } from "react";
import { Fingerprint } from "@phosphor-icons/react";
import { startAuthentication } from "@simplewebauthn/browser";
import { login } from "@/app/admin/actions";
import { useAdminHref } from "@/components/admin/AdminBase";
import { Field, inputClass, primaryButton, secondaryButton } from "@/components/admin/ui";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, {});
  const { href } = useAdminHref();
  const [passkeyError, setPasskeyError] = useState<string | null>(null);
  const [passkeyBusy, setPasskeyBusy] = useState(false);

  async function signInWithPasskey() {
    setPasskeyError(null);
    setPasskeyBusy(true);
    try {
      const optionsRes = await fetch(href("/api/passkey/login-options"), { method: "POST" });
      if (!optionsRes.ok) throw new Error((await optionsRes.json()).error ?? "Couldn't start passkey sign-in.");
      const response = await startAuthentication({ optionsJSON: await optionsRes.json() });

      const verifyRes = await fetch(href("/api/passkey/login-verify"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response }),
      });
      if (!verifyRes.ok) throw new Error((await verifyRes.json()).error ?? "Couldn't verify the passkey.");
      window.location.assign(href());
    } catch (e) {
      const cancelled = e instanceof Error && e.name === "NotAllowedError";
      setPasskeyError(cancelled ? "Passkey sign-in was cancelled." : e instanceof Error ? e.message : "Passkey sign-in failed.");
      setPasskeyBusy(false);
    }
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      <button type="button" onClick={signInWithPasskey} disabled={passkeyBusy} className={primaryButton}>
        <Fingerprint size={20} weight="bold" />
        {passkeyBusy ? "Waiting for your device…" : "Sign in with passkey"}
      </button>
      {passkeyError && (
        <p role="alert" className="text-center text-sm font-medium text-danger">
          {passkeyError}
        </p>
      )}

      <div className="flex items-center gap-3 text-xs font-semibold tracking-[0.08em] text-slate uppercase" aria-hidden>
        <span className="h-px flex-1 bg-line" />
        or
        <span className="h-px flex-1 bg-line" />
      </div>

      <form action={action} className="flex flex-col gap-4">
        <Field id="password" label="Password" error={state.error}>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            aria-invalid={!!state.error}
            aria-describedby={state.error ? "password-error" : undefined}
            className={inputClass(!!state.error)}
          />
        </Field>
        <button type="submit" disabled={pending} className={secondaryButton}>
          {pending ? "Signing in…" : "Sign in with password"}
        </button>
      </form>
    </div>
  );
}
