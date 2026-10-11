import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminBase, adminPath } from "@/lib/admin-path";
import { createSessionToken, SESSION_COOKIE, SESSION_IDLE, verifySessionToken } from "@/lib/admin-session";

export async function isAdmin() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/** Call at the top of every admin page, server action and route handler. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect(adminPath("/login"));
}

/** The cookie is scoped to the secret path, so it is never sent to the public storefront. */
export async function startSession() {
  const store = await cookies();
  store.set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: adminBase() ?? "/",
    maxAge: SESSION_IDLE,
  });
}

export async function endSession() {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", { path: adminBase() ?? "/", maxAge: 0 });
}
