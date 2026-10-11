/**
 * Single-owner admin session: an httpOnly cookie holding `<expires>.<started>.<hmac>`,
 * signed with ADMIN_SESSION_SECRET. Uses Web Crypto so it runs in middleware
 * (edge) as well as in server actions and route handlers.
 *
 * The session slides: it lasts 7 days from the last visit (middleware re-issues the
 * cookie), but never more than 30 days after the sign-in.
 */

export const SESSION_COOKIE = "tilly_admin";
export const SESSION_IDLE = 60 * 60 * 24 * 7; // seconds of inactivity before sign-out
export const SESSION_MAX = 60 * 60 * 24 * 30; // hard cap from sign-in
const REFRESH_AFTER = 60 * 60 * 24; // re-issue the cookie at most once a day

const encoder = new TextEncoder();
const now = () => Math.floor(Date.now() / 1000);

function base64url(bytes: ArrayBuffer) {
  let binary = "";
  for (const b of new Uint8Array(bytes)) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function hmac(value: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("ADMIN_SESSION_SECRET must be set (32+ characters).");

  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return base64url(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
}

/** Constant-time string comparison. */
export function safeEqual(a: string, b: string) {
  const left = encoder.encode(a);
  const right = encoder.encode(b);
  let diff = left.length ^ right.length;
  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    diff |= (left[i] ?? 0) ^ (right[i] ?? 0);
  }
  return diff === 0;
}

async function sign(started: number) {
  const expires = Math.min(now() + SESSION_IDLE, started + SESSION_MAX);
  return `${expires}.${started}.${await hmac(`${expires}.${started}`)}`;
}

export const createSessionToken = () => sign(now());

/** Returns null for an invalid session; otherwise whether the cookie is due a refresh. */
export async function readSessionToken(token: string | undefined): Promise<{ refreshed?: string } | null> {
  if (!token) return null;
  const [expires, started, signature] = token.split(".");
  if (!expires || !started || !signature || !/^\d+$/.test(expires) || !/^\d+$/.test(started)) return null;
  if (Number(expires) < now() || Number(started) + SESSION_MAX < now()) return null;
  if (!safeEqual(signature, await hmac(`${expires}.${started}`))) return null;

  const stale = Number(expires) - now() < SESSION_IDLE - REFRESH_AFTER;
  return stale ? { refreshed: await sign(Number(started)) } : {};
}

export async function verifySessionToken(token: string | undefined) {
  return (await readSessionToken(token)) !== null;
}

/** Short-lived signed value for WebAuthn challenges: `<payload>.<expires>.<hmac>`. */
export async function sealChallenge(payload: string, ttl = 300) {
  const expires = now() + ttl;
  return `${payload}.${expires}.${await hmac(`challenge:${payload}.${expires}`)}`;
}

export async function openChallenge(sealed: string | undefined) {
  if (!sealed) return null;
  const [payload, expires, signature] = sealed.split(".");
  if (!payload || !expires || !signature || Number(expires) < now()) return null;
  return safeEqual(signature, await hmac(`challenge:${payload}.${expires}`)) ? payload : null;
}
