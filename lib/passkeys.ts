import "server-only";
import { cookies } from "next/headers";
import { adminBase } from "@/lib/admin-path";
import { openChallenge, sealChallenge } from "@/lib/admin-session";
import { db } from "@/lib/db";

export const RP_NAME = "Tilly's Gallery admin";
const CHALLENGE_COOKIE = "tilly_pk";

export type StoredPasskey = {
  id: string;
  publicKey: string;
  counter: number;
  transports: string[] | null;
  label: string;
  createdAt: string;
  lastUsedAt: string | null;
};

/** Passkeys are bound to the site's domain, which we read from the request. */
export function relyingParty(request: Request) {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  const local = host.startsWith("localhost") || host.startsWith("127.0.0.1");
  const proto = request.headers.get("x-forwarded-proto") ?? (local ? "http" : "https");
  return { rpID: host.split(":")[0], origin: `${proto}://${host}` };
}

export async function saveChallenge(challenge: string) {
  const store = await cookies();
  store.set(CHALLENGE_COOKIE, await sealChallenge(challenge), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: adminBase() ?? "/",
    maxAge: 300,
  });
}

/** Reads and clears the challenge so each one is used once. */
export async function takeChallenge() {
  const store = await cookies();
  const challenge = await openChallenge(store.get(CHALLENGE_COOKIE)?.value);
  store.set(CHALLENGE_COOKIE, "", { path: adminBase() ?? "/", maxAge: 0 });
  return challenge;
}

const toPasskey = (r: Record<string, unknown>): StoredPasskey => ({
  id: r.id as string,
  publicKey: r.public_key as string,
  counter: Number(r.counter),
  transports: (r.transports as string[] | null) ?? null,
  label: r.label as string,
  createdAt: new Date(r.created_at as string).toISOString(),
  lastUsedAt: r.last_used_at ? new Date(r.last_used_at as string).toISOString() : null,
});

export async function listPasskeys() {
  const rows = await db()`select * from admin_passkeys order by created_at`;
  return rows.map(toPasskey);
}

export async function findPasskey(id: string) {
  const [row] = await db()`select * from admin_passkeys where id = ${id}`;
  return row ? toPasskey(row) : null;
}
