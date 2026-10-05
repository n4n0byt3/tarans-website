"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site-config";
import {
  claimOffer,
  closeOfferModal,
  openOfferModal,
  recentlyDismissed,
  useOfferState,
  useTimeLeft,
} from "@/lib/offer-client";
import ScratchCard from "./ScratchCard";
import Logo from "./Logo";

// Pages where the offer may open by itself: the homepage and the product
// page. Everywhere else it only opens when someone asks for it (the
// "get 10% off" links on the product page and in the basket).
function canAutoOpen(pathname) {
  return pathname === "/" || pathname === "/beard-oil";
}
const OPEN_AFTER_MS = 6000;
const OPEN_AFTER_SCROLL = 0.35;
const SHOWN_THIS_SESSION = "first-drop-offer-shown";

const { validHours } = siteConfig.offer;

function useAutoOpen() {
  const pathname = usePathname();
  const { offer } = useOfferState();

  useEffect(() => {
    if (!canAutoOpen(pathname) || offer || recentlyDismissed()) return;
    try {
      if (sessionStorage.getItem(SHOWN_THIS_SESSION)) return;
    } catch {
      // storage blocked — fall through and allow one open
    }

    let done = false;
    function trigger() {
      if (done) return;
      done = true;
      try {
        sessionStorage.setItem(SHOWN_THIS_SESSION, "1");
      } catch {}
      openOfferModal();
    }
    function onScroll() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable > 0 && window.scrollY / scrollable >= OPEN_AFTER_SCROLL) trigger();
    }

    const timer = setTimeout(trigger, OPEN_AFTER_MS);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      done = true;
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname, offer]);
}

export default function EmailOfferModal() {
  useAutoOpen();
  const { modalOpen } = useOfferState();
  if (!modalOpen) return null;
  return <OfferDialog />;
}

function OfferDialog() {
  const pathname = usePathname();
  const { offer } = useOfferState();
  const [step, setStep] = useState(offer ? "revealed" : "form");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const timeLeft = useTimeLeft(offer?.expiresAt);

  // Escape closes; the page behind stops scrolling; focus goes back to where
  // it was afterwards. On touch screens focus goes to the dialog rather than
  // the email box, so the keyboard doesn't jump up before anyone's read it.
  useEffect(() => {
    const previous = document.activeElement;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    (finePointer ? inputRef.current : dialogRef.current)?.focus();

    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e) {
      if (e.key === "Escape") closeOfferModal();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      await claimOffer(email, company);
      setStep("scratch");
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(offer.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the code is on screen and in their inbox anyway.
    }
  }

  // On the product page, closing the pop-up already leaves them at the button.
  const preorderHref = "/beard-oil";

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-5">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/60 animate-[fade-in_0.2s_ease] motion-reduce:animate-none"
        onClick={closeOfferModal}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="offer-title"
        tabIndex={-1}
        className="relative w-full sm:max-w-md max-h-[92vh] overflow-y-auto bg-navy border border-ink/10 rounded-t-3xl sm:rounded-3xl px-6 pt-12 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-8 shadow-2xl focus:outline-none animate-[sheet-up_0.3s_ease] sm:animate-fade-in-up motion-reduce:animate-none"
      >
        <button
          type="button"
          onClick={closeOfferModal}
          aria-label="Close"
          className="absolute top-3 right-3 w-11 h-11 rounded-full border border-ink/20 text-ink text-xl leading-none flex items-center justify-center hover:border-ink/50 transition-colors"
        >
          <span aria-hidden="true">×</span>
        </button>

        {step === "form" && (
          <>
            <Logo className="h-7 mb-6" />
            <p className="text-teal text-xs font-semibold uppercase tracking-widest">
              Your first {siteConfig.brandName} drop
            </p>
            <h2 id="offer-title" className="text-2xl font-bold mt-2">
              Unlock a discount on the first drop
            </h2>
            <p className="text-ink/70 mt-3">
              Enter your email to reveal your offer. It&apos;s yours to use on a pre-order for{" "}
              {validHours} hours.
            </p>
            <form onSubmit={onSubmit} className="mt-6 space-y-3" noValidate>
              <label className="block">
                <span className="sr-only">Email address</span>
                <input
                  ref={inputRef}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-cream border border-ink/20 rounded-full px-5 py-3.5 text-base text-ink placeholder:text-ink/40 focus:outline-none focus:border-teal"
                />
              </label>
              {/* Honeypot for bots: hidden from people and screen readers. */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="absolute -left-[9999px] w-px h-px opacity-0"
              />
              <button
                type="submit"
                disabled={pending}
                className="w-full bg-ink text-cream rounded-full py-3.5 font-semibold uppercase tracking-wide text-sm transition-all duration-200 hover:opacity-85 active:scale-95 disabled:opacity-50"
              >
                {pending ? "Unlocking…" : "Reveal my discount"}
              </button>
              {error && (
                <p role="alert" className="text-red-400 text-sm">
                  {error}
                </p>
              )}
            </form>
            <p className="text-ink/45 text-xs mt-4 leading-relaxed">
              We&apos;ll email your code, then the occasional update as we build. Unsubscribe any
              time.{" "}
              <Link href="/privacy" onClick={closeOfferModal} className="underline">
                Privacy
              </Link>
            </p>
            <button
              type="button"
              onClick={closeOfferModal}
              className="mt-4 w-full text-sm text-ink/60 hover:text-ink py-2"
            >
              No thanks
            </button>
          </>
        )}

        {(step === "scratch" || step === "revealed") && offer && (
          <>
            <p className="text-teal text-xs font-semibold uppercase tracking-widest">
              {step === "scratch" ? "Scratch to reveal your offer" : "Unlocked"}
            </p>
            <h2 id="offer-title" className="text-2xl font-bold mt-2 mb-5">
              {step === "scratch"
                ? "Here's what you've got"
                : `Your ${offer.percentOff}% discount has been unlocked`}
            </h2>

            {step === "scratch" ? (
              <ScratchCard onReveal={() => setStep("revealed")}>
                <OfferFace offer={offer} />
              </ScratchCard>
            ) : (
              <div className="h-36 rounded-2xl border border-teal/40 bg-navy flex flex-col items-center justify-center text-center p-4">
                <OfferFace offer={offer} />
              </div>
            )}

            {step === "revealed" && (
              <div className="mt-5 space-y-4">
                <p className="text-ink/70 text-sm leading-relaxed">
                  Use it when you pre-order the first {siteConfig.brandName} drop. It&apos;s applied
                  automatically at checkout on this device
                  {timeLeft && timeLeft !== "expired" ? ` — ${timeLeft}.` : "."}
                </p>
                <div className="flex items-center justify-between gap-3 border border-ink/15 rounded-full pl-5 pr-1.5 py-1.5">
                  <span className="text-sm">
                    <span className="text-ink/50">Code </span>
                    <span className="font-semibold tracking-wider">{offer.code}</span>
                  </span>
                  <button
                    type="button"
                    onClick={copyCode}
                    className="text-xs font-semibold border border-ink/20 rounded-full px-3 py-1.5 hover:border-ink/50 transition-colors"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <p className="text-ink/45 text-xs">
                  We&apos;ve emailed it to you too, for use on another device.
                </p>
                <Link
                  href={preorderHref}
                  onClick={closeOfferModal}
                  className="block w-full text-center bg-ink text-cream rounded-full py-3.5 font-semibold uppercase tracking-wide text-sm transition-all duration-200 hover:opacity-85 active:scale-95"
                >
                  Pre-order the first drop
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function OfferFace({ offer }) {
  return (
    <>
      <p className="text-4xl font-bold text-teal">{offer.percentOff}% OFF</p>
      <p className="text-ink/70 text-sm mt-1">your pre-order of the first drop</p>
    </>
  );
}

