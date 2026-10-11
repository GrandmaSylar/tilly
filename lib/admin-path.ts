/**
 * The dashboard lives at a secret path taken from ADMIN_PATH (see .env.local), never at /admin.
 * Middleware rewrites `/<ADMIN_PATH>/...` onto the internal `app/admin` routes and 404s the
 * internal paths when requested directly. Edge-safe: no Node-only imports.
 */

const VALID = /^[a-z0-9]{16,64}$/;

/** `/<ADMIN_PATH>`, or null when the secret is missing or too weak (admin is then switched off). */
export function adminBase(): string | null {
  const secret = process.env.ADMIN_PATH?.trim().toLowerCase();
  return secret && VALID.test(secret) ? `/${secret}` : null;
}

/** Public URL for an admin page or API route, e.g. adminPath("/products") -> "/<secret>/products". */
export function adminPath(sub = "") {
  const base = adminBase();
  if (!base) throw new Error("ADMIN_PATH must be set (16+ lowercase letters and digits).");
  return `${base}${sub}`;
}
