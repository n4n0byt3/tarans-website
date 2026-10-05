"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MAX_LINE_QUANTITY, useCart } from "@/lib/cart-context";
import { siteConfig } from "@/lib/site-config";
import { formatPrice } from "@/lib/format";
import { bundleSuggestion } from "@/lib/bundles";
import { openOfferModal, useOfferState, useTimeLeft } from "@/lib/offer-client";
import PurchaseReassurance from "./PurchaseReassurance";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, addItem, subtotalCents } = useCart();
  const { offer } = useOfferState();
  const offerTimeLeft = useTimeLeft(offer?.expiresAt);
  const offerActive = offer && offerTimeLeft && offerTimeLeft !== "expired";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const closeButtonRef = useRef(null);
  const checkoutButtonRef = useRef(null);
  const returnFocusRef = useRef(null);

  // Coming back from Stripe via the browser's back button restores this page
  // from the bfcache with its old JS state, which would otherwise leave the
  // button stuck on "Redirecting…" forever.
  useEffect(() => {
    function resetLoading(event) {
      if (event.persisted || document.visibilityState === "visible") {
        setLoading(false);
      }
    }
    window.addEventListener("pageshow", resetLoading);
    window.addEventListener("visibilitychange", resetLoading);
    return () => {
      window.removeEventListener("pageshow", resetLoading);
      window.removeEventListener("visibilitychange", resetLoading);
    };
  }, []);

  // Keyboard users: focus moves into the drawer when it opens, Escape closes
  // it, and focus goes back to whatever opened it.
  useEffect(() => {
    if (!isOpen) return;
    returnFocusRef.current = document.activeElement;
    closeButtonRef.current?.focus();

    function onKey(e) {
      if (e.key === "Escape") closeCart();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      returnFocusRef.current?.focus?.();
    };
  }, [isOpen, closeCart]);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Could not start checkout");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  const hasItems = items.length > 0;
  const freeDelivery = subtotalCents >= siteConfig.freeShippingThresholdCents;
  const deliveryCents = hasItems && !freeDelivery ? siteConfig.flatShippingCents : 0;
  const toFreeDeliveryCents = siteConfig.freeShippingThresholdCents - subtotalCents;
  // Stripe takes the percentage off the products, not delivery — mirrored
  // here so the total shown matches what checkout charges.
  const discountCents = offerActive ? Math.round((subtotalCents * offer.percentOff) / 100) : 0;
  const suggestion = bundleSuggestion(items);

  function applySuggestion() {
    const single = items.find((i) => i.slug === "one-bottle");
    updateQuantity("one-bottle", single.quantity - suggestion.singlesToReplace);
    addItem(suggestion.target, 1);
    // The swap button disappears once applied, which would drop keyboard
    // focus back to the page body behind the drawer.
    requestAnimationFrame(() => checkoutButtonRef.current?.focus());
  }

  return (
    <>
      <div
        aria-hidden="true"
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        // Off-screen but still in the page: inert stops keyboard focus and
        // screen readers wandering into the closed drawer.
        inert={!isOpen}
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-navy border-l border-ink/10 z-50 shadow-xl flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-ink/10">
          <h2 id="cart-title" className="font-bold text-lg">
            Your basket
          </h2>
          <button
            ref={closeButtonRef}
            onClick={closeCart}
            className="text-ink/60 hover:text-ink text-sm"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {!hasItems && (
            <div className="text-sm">
              <p className="text-ink/60">Your basket is empty.</p>
              <Link
                href="/beard-oil"
                onClick={closeCart}
                className="inline-block mt-3 text-teal hover:underline underline-offset-4"
              >
                Pre-order the first drop →
              </Link>
            </div>
          )}

          {items.map((item) => (
            <div key={item.slug} className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-ink/60 text-xs">{formatPrice(item.priceCents)} each</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  aria-label={`Remove one ${item.name}`}
                  className="w-7 h-7 rounded-full border border-ink/20 text-sm transition-transform active:scale-90"
                  onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                >
                  −
                </button>
                <span className="w-5 text-center text-sm" aria-live="polite">
                  {item.quantity}
                </span>
                <button
                  aria-label={`Add one more ${item.name}`}
                  disabled={item.quantity >= MAX_LINE_QUANTITY}
                  className="w-7 h-7 rounded-full border border-ink/20 text-sm transition-transform active:scale-90 disabled:opacity-30"
                  onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
          ))}

          {suggestion && (
            <div className="border border-teal/40 bg-teal/10 rounded-xl p-4">
              <p className="text-sm text-ink">
                Swap {suggestion.singlesToReplace} single bottles for the{" "}
                <strong>{suggestion.target.name}</strong> pack and save{" "}
                <strong className="text-teal">{formatPrice(suggestion.saveCents)}</strong>.
              </p>
              <button
                onClick={applySuggestion}
                className="mt-3 w-full bg-teal text-cream rounded-full py-2 text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-95"
              >
                Swap & save {formatPrice(suggestion.saveCents)}
              </button>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-ink/10 space-y-3">
          {hasItems && !freeDelivery && (
            <p className="text-xs text-teal">
              Add {formatPrice(toFreeDeliveryCents)} more for free delivery.
            </p>
          )}
          <div className="flex justify-between text-sm text-ink/70">
            <span>Subtotal</span>
            <span>{formatPrice(subtotalCents)}</span>
          </div>
          {hasItems && (
            <div className="flex justify-between text-sm text-ink/70">
              <span>Delivery</span>
              <span>{deliveryCents === 0 ? "Free" : formatPrice(deliveryCents)}</span>
            </div>
          )}
          {hasItems && offerActive && (
            <div className="flex justify-between text-sm text-teal">
              <span>
                First-drop {offer.percentOff}% off
                <span className="block text-[11px] text-ink/45">
                  Applied at checkout · {offerTimeLeft}
                </span>
              </span>
              <span>−{formatPrice(discountCents)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatPrice(subtotalCents - discountCents + deliveryCents)}</span>
          </div>
          {hasItems && !offerActive && (
            <button
              type="button"
              onClick={openOfferModal}
              className="text-xs text-teal hover:underline underline-offset-4"
            >
              Get {siteConfig.offer.percentOff}% off your pre-order →
            </button>
          )}
          {error && (
            <p role="alert" className="text-red-400 text-xs">
              {error}
            </p>
          )}
          <button
            ref={checkoutButtonRef}
            disabled={!hasItems || loading}
            onClick={handleCheckout}
            className="w-full bg-ink text-cream rounded-full py-3 font-semibold disabled:opacity-40 transition-all duration-200 hover:opacity-85 active:scale-95"
          >
            {loading ? "Redirecting…" : "Pre-order securely"}
          </button>
          {hasItems && <PurchaseReassurance onNavigate={closeCart} className="pt-1" />}
        </div>
      </aside>
    </>
  );
}
