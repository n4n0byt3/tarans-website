"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { useCart } from "@/lib/cart-context";

const links = [
  { href: "/#shop", label: "Shop" },
  { href: "/#story", label: "Our Story" },
  { href: "/#faq", label: "FAQ" },
];

export default function Nav() {
  const { itemCount, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-ink/10">
      <nav className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="sm:hidden -ml-2 w-10 h-10 flex items-center justify-center text-ink"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              {menuOpen ? (
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
          <Link href="/" className="p-1" onClick={() => setMenuOpen(false)}>
            <Logo className="h-8" priority />
          </Link>
        </div>

        <div className="hidden sm:flex items-center gap-8 text-sm font-medium text-ink/80">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-ink transition-colors">
              {link.label}
            </Link>
          ))}
        </div>

        <button
          onClick={openCart}
          aria-label={itemCount > 0 ? `Basket, ${itemCount} item${itemCount === 1 ? "" : "s"}` : "Basket"}
          className="relative rounded-full bg-ink text-cream px-4 py-2 text-sm font-semibold transition-all duration-200 hover:opacity-85 active:scale-95"
        >
          Basket
          {itemCount > 0 && (
            <span
              key={itemCount}
              aria-hidden="true"
              className="absolute -top-2 -right-2 bg-teal text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-[pop_0.3s_ease]"
            >
              {itemCount}
            </span>
          )}
        </button>
      </nav>

      {menuOpen && (
        <div id="mobile-menu" className="sm:hidden border-t border-ink/10 bg-cream">
          <ul className="mx-auto max-w-6xl px-5 py-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 text-ink/80 hover:text-ink border-b border-ink/5 last:border-0"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
