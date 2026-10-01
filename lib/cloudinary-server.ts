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
