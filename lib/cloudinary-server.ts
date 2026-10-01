import "server-only";
import { createHash } from "node:crypto";

export const UPLOAD_FOLDER = "tilly-products";

/** Reads CLOUDINARY_URL (cloudinary://<api_key>:<api_secret>@<cloud_name>). */
export function cloudinaryConfig() {
  const raw = process.env.CLOUDINARY_URL;
  if (!raw) throw new Error("CLOUDINARY_URL must be set.");

  const url = new URL(raw);
  const config = {
    cloudName: url.hostname,
    apiKey: decodeURIComponent(url.username),
    apiSecret: decodeURIComponent(url.password),
  };
  if (!config.cloudName || !config.apiKey || !config.apiSecret) throw new Error("CLOUDINARY_URL is malformed.");
  return config;
}

/**
 * Signs upload parameters per Cloudinary's spec: params sorted alphabetically,
 * joined as key=value with &, the API secret appended, then SHA-1 hashed.
 */
export function signUpload(params: Record<string, string | number>) {
  const { apiSecret } = cloudinaryConfig();
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return createHash("sha1").update(toSign + apiSecret).digest("hex");
}

/** Only accept image URLs we serve ourselves: launch photos in /public or our Cloudinary folder. */
export function isAllowedImageUrl(url: string) {
  if (/^\/images\/[\w.-]+$/.test(url)) return true;
  const { cloudName } = cloudinaryConfig();
  return url.startsWith(`https://res.cloudinary.com/${cloudName}/image/upload/`);
}

/**
 * Cloudinary public ID for one of our uploads, e.g.
 * https://res.cloudinary.com/<cloud>/image/upload/v1790881266/tilly-products/abc.jpg → tilly-products/abc.
 * Returns null for anything outside our upload folder (such as the launch photos in /public).
 */
export function publicIdFromUrl(url: string) {
  const match = url.match(/\/image\/upload\/(?:v\d+\/)?(.+)\.[a-z0-9]+$/i);
  const id = match?.[1];
  return id && id.startsWith(`${UPLOAD_FOLDER}/`) ? id : null;
}

/** Deletes a product photo from Cloudinary. Never throws: a leftover image shouldn't block a product change. */
export async function deleteUploadedImage(url: string | null | undefined) {
  const publicId = url ? publicIdFromUrl(url) : null;
  if (!publicId) return;

  try {
    const { cloudName, apiKey } = cloudinaryConfig();
    const params = { invalidate: "true", public_id: publicId, timestamp: Math.round(Date.now() / 1000) };
    const body = new FormData();
    for (const [key, value] of Object.entries(params)) body.append(key, String(value));
    body.append("api_key", apiKey);
    body.append("signature", signUpload(params));

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, { method: "POST", body });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || (data.result !== "ok" && data.result !== "not found")) {
      console.error(`Cloudinary delete failed for ${publicId}:`, data.error?.message ?? data.result ?? res.status);
    }
  } catch (e) {
    console.error(`Cloudinary delete failed for ${publicId}:`, e);
  }
}
