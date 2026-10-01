/**
 * Inserts a Cloudinary delivery transformation after `/upload/` so photos are
 * served resized, in the best format for the browser (WebP/AVIF) and at auto
 * quality. Non-Cloudinary URLs (e.g. the launch photos in /public) pass through.
 */
export function cloudinaryUrl(url: string, width: number) {
  if (!url.includes("res.cloudinary.com")) return url;

  const marker = "/upload/";
  const i = url.indexOf(marker);
  if (i === -1) return url;

  return `${url.slice(0, i + marker.length)}f_auto,q_auto,c_limit,w_${width}/${url.slice(i + marker.length)}`;
}
