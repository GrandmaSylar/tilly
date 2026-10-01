"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";
import { Field, inputClass, primaryButton } from "@/components/admin/ui";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, {});

  return (
    <form action={action} className="mt-6 flex flex-col gap-4">
      <Field id="password" label="Password" error={state.error}>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          aria-invalid={!!state.error}
          aria-describedby={state.error ? "password-error" : undefined}
          className={inputClass(!!state.error)}
        />
      </Field>
      <button type="submit" disabled={pending} className={primaryButton}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
