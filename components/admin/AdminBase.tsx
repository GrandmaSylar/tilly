"use client";

import { createContext, useCallback, useContext } from "react";

const AdminBaseContext = createContext("");

/** Gives client components the secret admin path without baking it into the public bundle. */
export function AdminBaseProvider({ base, children }: { base: string; children: React.ReactNode }) {
  return <AdminBaseContext.Provider value={base}>{children}</AdminBaseContext.Provider>;
}

/** `href("/products")` -> "/<secret>/products". Also exposes `strip` to turn a pathname back into "/products". */
export function useAdminHref() {
  const base = useContext(AdminBaseContext);
  const href = useCallback((sub = "") => `${base}${sub}`, [base]);
  const strip = useCallback((pathname: string) => (pathname.startsWith(base) ? pathname.slice(base.length) || "/" : pathname), [base]);
  return { href, strip };
}
