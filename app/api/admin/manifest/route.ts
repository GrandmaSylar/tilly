import { adminBase } from "@/lib/admin-path";

/** Web app manifest for the installable admin app, scoped to the secret path. */
export function GET() {
  const base = adminBase();
  if (!base) return new Response(null, { status: 404 });

  return Response.json(
    {
      id: `${base}/`,
      name: "Tilly's Admin",
      short_name: "Tilly Admin",
      description: "Manage Tilly's Gallery products and stock.",
      start_url: `${base}/`,
      scope: `${base}/`,
      display: "standalone",
      orientation: "portrait",
      background_color: "#2A201C",
      theme_color: "#2A201C",
      icons: [
        { src: "/icons/admin-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icons/admin-512.png", sizes: "512x512", type: "image/png" },
        { src: "/icons/admin-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      ],
    },
    { headers: { "Content-Type": "application/manifest+json", "Cache-Control": "no-store" } },
  );
}
