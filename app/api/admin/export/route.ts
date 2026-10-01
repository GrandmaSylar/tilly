import { NextResponse, type NextRequest } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { fetchProducts } from "@/lib/catalog";

const COLUMNS = [
  "slug", "name", "category", "price", "originalPrice", "stockQuantity",
  "isFeatured", "isBestseller", "sizes", "imageUrl", "description", "details", "delivery",
] as const;

function csvCell(value: unknown) {
  const text = Array.isArray(value) ? value.join(" | ") : value === undefined || value === null ? "" : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export async function GET(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const products = await fetchProducts();
  const date = new Date().toISOString().slice(0, 10);

  if (request.nextUrl.searchParams.get("format") === "json") {
    return new NextResponse(JSON.stringify(products, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="tilly-products-${date}.json"`,
      },
    });
  }

  const rows = [COLUMNS.join(","), ...products.map((p) => COLUMNS.map((c) => csvCell(p[c])).join(","))];
  // BOM so Excel opens the GH₵ sign and accents correctly.
  return new NextResponse("﻿" + rows.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="tilly-products-${date}.csv"`,
    },
  });
}
