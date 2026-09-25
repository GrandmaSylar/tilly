"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

const STORAGE_KEY = "tilly_wishlist";

type WishlistContextValue = {
  slugs: string[];
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
};

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setSlugs(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    // Skip the first run so the empty initial state never overwrites what was saved
    if (!hydrated.current) {
      hydrated.current = true;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
    } catch {}
  }, [slugs]);

  const toggle = useCallback((slug: string) => {
    setSlugs((current) => (current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug]));
  }, []);

  const value = useMemo(
    () => ({ slugs, has: (slug: string) => slugs.includes(slug), toggle }),
    [slugs, toggle]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
}
