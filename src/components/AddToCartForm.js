"use client";

import { useState } from "react";
import { MAX_LINE_QUANTITY, useCart } from "@/lib/cart-context";

export default function AddToCartForm({ product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <div className="mt-7 flex items-center gap-3">
      <div className="flex items-center border border-ink/20 rounded-full" role="group" aria-label="Quantity">
        <button
          type="button"
          aria-label="Decrease quantity"
          className="w-9 h-9 transition-transform active:scale-90 disabled:opacity-30"
          disabled={qty <= 1}
          onClick={() => setQty((q) => Math.max(1, q - 1))}
        >
          −
        </button>
        <span className="w-8 text-center" aria-live="polite">
          {qty}
        </span>
        <button
          type="button"
          aria-label="Increase quantity"
          className="w-9 h-9 transition-transform active:scale-90 disabled:opacity-30"
          disabled={qty >= MAX_LINE_QUANTITY}
          onClick={() => setQty((q) => Math.min(MAX_LINE_QUANTITY, q + 1))}
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={() => addItem(product, qty)}
        className="flex-1 bg-ink text-cream rounded-full py-3 font-semibold transition-all duration-200 hover:opacity-85 active:scale-95"
      >
        Pre-order
      </button>
    </div>
  );
}
