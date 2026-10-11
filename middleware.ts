import { NextResponse, type NextRequest } from "next/server";
import { adminBase } from "@/lib/admin-path";
import { SESSION_COOKIE, SESSION_IDLE, readSessionToken } from "@/lib/admin-session";

/** Pages and API calls a signed-out owner may reach (all still behind the secret path). */
const OPEN = new Set(["/login", "/api/manifest", "/api/passkey/login-options", "/api/passkey/login-verify"]);

const notFound = (request: NextRequest) => NextResponse.rewrite(new URL("/__not-found", request.url));

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The internal routes are never reachable directly.
  if (pathname === "/admin" || pathname.startsWith("/admin/") || pathname.startsWith("/api/admin")) return notFound(request);

  const base = adminBase();
  if (!base || (pathname !== base && !pathname.startsWith(`${base}/`))) return NextResponse.next();

  const sub = pathname.slice(base.length) || "/";
  const target = request.nextUrl.clone();
  target.pathname = sub.startsWith("/api/") ? `/api/admin${sub.slice(4)}` : `/admin${sub === "/" ? "" : sub}`;

  const session = await readSessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (!session && !OPEN.has(sub.replace(/\/$/, ""))) {
    if (sub.startsWith("/api/")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const login = request.nextUrl.clone();
    login.pathname = `${base}/login`;
    return NextResponse.redirect(login);
  }

  const response = NextResponse.rewrite(target);
  response.headers.set("Cache-Control", "no-store");
  if (session?.refreshed) {
    response.cookies.set(SESSION_COOKIE, session.refreshed, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: base,
      maxAge: SESSION_IDLE,
    });
  }
  return response;
}

export const config = {
  // Everything except Next internals and real static files (anything with a file extension).
  matcher: ["/((?!_next/|.*[.].*).*)"],
};
