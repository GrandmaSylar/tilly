import "server-only";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let client: NeonQueryFunction<false, false> | null = null;

/** Neon Postgres over HTTP. Server-only; DATABASE_URL is set by Vercel's Neon integration. */
export function db() {
  if (client) return client;

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL must be set.");

  client = neon(url);
  return client;
}
