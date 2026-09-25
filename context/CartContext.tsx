"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from "react";

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  size: string;
  image: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> & { quantity?: number } }
  | { type: "REMOVE_ITEM"; payload: { slug: string; size: string } }
  | { type: "UPDATE_QUANTITY"; payload: { slug: string; size: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE"; payload: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (item) => item.slug === action.payload.slug && item.size === action.payload.size
      );

      if (existing) {
        return {
          items: state.items.map((item) =>
            item.slug === action.payload.slug && item.size === action.payload.size
              ? { ...item, quantity: item.quantity + (action.payload.quantity ?? 1) }
              : item
          ),
        };
      }

      return {
        items: [
          ...state.items,
          { ...action.payload, quantity: action.payload.quantity ?? 1 },
        ],
      };
    }

    case "REMOVE_ITEM":
      return {
        items: state.items.filter(
          (item) => !(item.slug === action.payload.slug && item.size === action.payload.size)
        ),
      };

    case "UPDATE_QUANTITY":
      return {
        items: state.items.map((item) =>
          item.slug === action.payload.slug && item.size === action.payload.size
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        ),
      };

    case "CLEAR_CART":
      return { items: [] };

    case "HYDRATE":
      return { items: action.payload };

    default:
      return state;
  }
}

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (slug: string, size: string) => void;
  updateQuantity: (slug: string, size: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const STORAGE_KEY = "tilly_cart";

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [isOpen, setIsOpen] = useState(false);
  const hydrated = useRef(false);

  // Restore the bag after mount so server and client render the same markup
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) dispatch({ type: "HYDRATE", payload: JSON.parse(saved) });
    } catch {}
  }, []);

  useEffect(() => {
    // Skip the first run so the empty initial state never overwrites what was saved
    if (!hydrated.current) {
      hydrated.current = true;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {}
  }, [state.items]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = state.items.reduce((total, item) => total + item.price * item.quantity, 0);

    return {
      items: state.items,
      itemCount,
      subtotal,
      isOpen,
      addItem: (item) => dispatch({ type: "ADD_ITEM", payload: item }),
      removeItem: (slug, size) => dispatch({ type: "REMOVE_ITEM", payload: { slug, size } }),
      updateQuantity: (slug, size, quantity) =>
        dispatch({ type: "UPDATE_QUANTITY", payload: { slug, size, quantity } }),
      clearCart: () => dispatch({ type: "CLEAR_CART" }),
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    };
  }, [state.items, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
