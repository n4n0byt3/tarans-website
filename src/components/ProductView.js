"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PRODUCT,
  products,
  highlights,
  features,
  howToUse,
  productDetails,
  ingredientsInci,
  oilDescription,
  BOTTLE_SIZE,
} from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { siteConfig, shipStatus } from "@/lib/site-config";
import { MAX_LINE_QUANTITY, useCart } from "@/lib/cart-context";
import { openOfferModal, useOfferState, useTimeLeft } from "@/lib/offer-client";

const brand = siteConfig.brandName;

// The labelled bottle first, then a photo per pack. Picking a pack shows
// its photo, so the gallery and the options stay in step.
const gallery = [
  { src: PRODUCT.image.src, alt: `${brand} beard oil, ${BOTTLE_SIZE} dropper bottle` },
  ...products.map((p) => ({ src: p.image, alt: `${brand} beard oil, ${p.scent}`, slug: p.slug })),
];

const iconPaths = {
  drop: <path d="M12 3.5s-6 6.6-6 11a6 6 0 0 0 12 0c0-4.4-6-11-6-11Z" />,
  shield: (
    <>
      <path d="M12 3 5 6v5.5c0 4.2 2.9 7.9 7 9.5 4.1-1.6 7-5.3 7-9.5V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  feather: (
    <>
      <path d="M20 4c-6 0-11 4-12 11l-1 5" />
      <path d="M20 4c0 7-4 11-11 12" />
      <path d="M8 15h6" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14H5Z" />
      <path d="M5 19 13 11" />
    </>
  ),
  truck: (
    <>
      <path d="M3 6h11v10H3zM14 9h4l3 3v4h-7" />
      <circle cx="7" cy="17.5" r="1.5" />
      <circle cx="17" cy="17.5" r="1.5" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
};

function Icon({ name, className = "w-6 h-6" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {iconPaths[name]}
    </svg>
  );
}

// Native <details>, so the sections open without JavaScript and work with
// a keyboard and screen reader out of the box.
function Section({ title, children }) {
  return (
    <details className="group border-b border-ink/10">
      <summary className="flex items-center justify-between py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden text-xs font-semibold uppercase tracking-widest">
        {title}
        <span
          aria-hidden="true"
          className="text-teal text-xl leading-none transition-transform duration-300 group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="pb-5 text-sm text-ink/70 leading-relaxed">{children}</div>
    </details>
  );
}

export default function ProductView() {
  const { addItem } = useCart();
  const { offer } = useOfferState();
  const timeLeft = useTimeLeft(offer?.expiresAt);
  const offerActive = offer && timeLeft && timeLeft !== "expired";

  // A single bottle first: the lowest-commitment way to try a brand nobody
  // knows yet. The packs sit right beside it, with their savings shown.
  const [slug, setSlug] = useState(products[0].slug);
  const [imageIndex, setImageIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const selected = products.find((p) => p.slug === slug);
  const image = gallery[imageIndex];

  function choosePack(nextSlug) {
    setSlug(nextSlug);
    setImageIndex(gallery.findIndex((g) => g.slug === nextSlug));
  }

  return (
    <div className="grid gap-8 lg:gap-x-14 lg:grid-cols-[1.1fr_1fr] lg:grid-rows-[auto_1fr] items-start">
      {/* Photos: thumbnails down the side on a big screen, underneath on a phone. */}
      <div className="flex flex-col-reverse sm:flex-row gap-3">
        <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible -mx-5 px-5 sm:mx-0 sm:px-0">
          {gallery.map((g, i) => (
            <button
              key={g.src}
              type="button"
              onClick={() => setImageIndex(i)}
              aria-label={`Show photo ${i + 1}: ${g.alt}`}
              aria-pressed={i === imageIndex}
              className={`relative flex-none w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                i === imageIndex ? "border-teal" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={g.src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
        <div className="relative flex-1 aspect-square rounded-2xl overflow-hidden border border-ink/10 bg-peach-light">
          <Image
            key={image.src}
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover animate-[fade-in_0.3s_ease]"
          />
        </div>
      </div>

      {/* Everything needed to decide, then the button. */}
      <div className="lg:row-span-2">
        <p className="text-teal text-xs font-semibold uppercase tracking-widest">
          Beard care · Pre-order
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold mt-3">{PRODUCT.name}</h1>
        <p className="mt-3 text-xs sm:text-sm uppercase tracking-[0.3em] text-ink/60">
          {PRODUCT.keywords.join(" / ")}
        </p>

        <div className="mt-5 flex items-baseline gap-3">
          <p className="text-2xl font-bold">{formatPrice(selected.priceCents)}</p>
          {selected.compareAtCents && (
            <p className="text-ink/40 line-through" title="Price as single bottles">
              <span className="sr-only">Price as single bottles: </span>
              {formatPrice(selected.compareAtCents)}
            </p>
          )}
        </div>

        <p className="mt-4 text-ink/75 leading-relaxed">{oilDescription}</p>

        <ul className="mt-6 grid grid-cols-4 gap-2 text-center">
          {highlights.map((h) => (
            <li key={h.label} className="flex flex-col items-center">
              <span className="w-12 h-12 rounded-full border border-ink/20 flex items-center justify-center text-ink">
                <Icon name={h.icon} />
              </span>
              <span className="mt-2 text-[11px] sm:text-xs text-ink/70 leading-snug">{h.label}</span>
            </li>
          ))}
        </ul>

        <fieldset className="mt-7">
          <legend className="sr-only">Choose your pack</legend>
          <div className="grid gap-3">
            {products.map((p) => {
              const checked = p.slug === slug;
              return (
                <label
                  key={p.slug}
                  className={`flex items-center gap-4 rounded-xl border px-4 py-3.5 cursor-pointer transition-colors ${
                    checked ? "border-ink/70 bg-navy" : "border-ink/15 hover:border-ink/35"
                  }`}
                >
                  <input
                    type="radio"
                    name="pack"
                    value={p.slug}
                    checked={checked}
                    onChange={() => choosePack(p.slug)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={`w-5 h-5 rounded-full border-2 flex-none flex items-center justify-center ${
                      checked ? "border-ink" : "border-ink/30"
                    }`}
                  >
                    {checked && <span className="w-2.5 h-2.5 rounded-full bg-ink" />}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">{p.name}</span>
                      {p.isBestValue && (
                        <span className="bg-teal text-cream text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full">
                          Best value
                        </span>
                      )}
                    </span>
                    <span className="block text-ink/55 text-xs mt-0.5">
                      {p.supply}
                      {p.bottles > 1 &&
                        ` · ${formatPrice(Math.round(p.priceCents / p.bottles))} a bottle · save ${formatPrice(p.savingCents)}`}
                    </span>
                  </span>
                  <span className="font-bold">{formatPrice(p.priceCents)}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-4 text-sm" aria-live="polite">
          {offerActive ? (
            <p className="text-teal">
              ✓ Your {offer.percentOff}% off is applied at checkout · {timeLeft}
            </p>
          ) : (
            <button
              type="button"
              onClick={openOfferModal}
              className="text-teal hover:underline underline-offset-4"
            >
              Get {siteConfig.offer.percentOff}% off your pre-order →
            </button>
          )}
        </div>

        <div className="mt-5 flex items-center gap-3">
          <div className="flex items-center border border-ink/20 rounded-full" role="group" aria-label="Quantity">
            <button
              type="button"
              aria-label="Decrease quantity"
              className="w-10 h-12 transition-transform active:scale-90 disabled:opacity-30"
              disabled={qty <= 1}
              onClick={() => setQty((q) => Math.max(1, q - 1))}
            >
              −
            </button>
            <span className="w-6 text-center" aria-live="polite">
              {qty}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              className="w-10 h-12 transition-transform active:scale-90 disabled:opacity-30"
              disabled={qty >= MAX_LINE_QUANTITY}
              onClick={() => setQty((q) => Math.min(MAX_LINE_QUANTITY, q + 1))}
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={() => addItem(selected, qty)}
            className="flex-1 h-12 bg-ink text-cream rounded-full font-semibold uppercase tracking-widest text-sm transition-all duration-200 hover:opacity-85 active:scale-95"
          >
            Pre-order
          </button>
        </div>
        <p className="text-ink/55 text-xs mt-3 leading-relaxed">
          {shipStatus()} Cancel any time before it ships for a full refund.
        </p>

        <ul className="mt-6 grid grid-cols-3 divide-x divide-ink/10 border-y border-ink/10 py-4 text-center text-[11px] sm:text-xs text-ink/70">
          <li className="flex flex-col items-center gap-1.5 px-2">
            <Icon name="truck" className="w-5 h-5 text-ink" />
            Free UK delivery over {formatPrice(siteConfig.freeShippingThresholdCents)}
          </li>
          <li className="flex flex-col items-center gap-1.5 px-2">
            <Icon name="shield" className="w-5 h-5 text-ink" />
            {siteConfig.guaranteeDays}-day money-back guarantee
          </li>
          <li className="flex flex-col items-center gap-1.5 px-2">
            <Icon name="lock" className="w-5 h-5 text-ink" />
            Secure checkout by Stripe
          </li>
        </ul>

        <div className="mt-2">
          <Section title="Product details">
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5">
              <dt className="text-ink/50">Size</dt>
              <dd>{BOTTLE_SIZE} dropper bottle</dd>
              {productDetails.map((d) => (
                <div key={d.label} className="contents">
                  <dt className="text-ink/50">{d.label}</dt>
                  <dd>{d.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-ink/50 text-xs">
              A cosmetic for your beard and the skin under it. It won&apos;t make your beard grow.
            </p>
          </Section>
          <Section title="How to use">
            <ol className="space-y-1.5 list-decimal pl-4">
              {howToUse.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </Section>
          <Section title="Ingredients">
            {ingredientsInci ? (
              <p>{ingredientsInci}</p>
            ) : (
              <p>
                The full ingredient list will be printed on the bottle. If you have allergies and want
                it before ordering, email{" "}
                <a href={`mailto:${siteConfig.supportEmail}`} className="text-teal hover:underline">
                  {siteConfig.supportEmail}
                </a>
                .
              </p>
            )}
            <p className="mt-3 text-ink/50 text-xs">
              For external use only. Patch test first if you have sensitive skin.
            </p>
          </Section>
          <Section title="Delivery & returns">
            <p>
              This is a pre-order. {shipStatus()} You can cancel any time before it ships for a full
              refund.
            </p>
            <p className="mt-2">
              {formatPrice(siteConfig.flatShippingCents)} UK delivery, free over{" "}
              {formatPrice(siteConfig.freeShippingThresholdCents)}. It arrives {siteConfig.transitText}{" "}
              after it ships. Once it&apos;s arrived, you have a {siteConfig.guaranteeDays}-day
              money-back guarantee, even if you&apos;ve opened it.
            </p>
            <p className="mt-2">
              <Link href="/shipping" className="text-teal hover:underline">
                Delivery
              </Link>{" "}
              ·{" "}
              <Link href="/returns" className="text-teal hover:underline">
                Returns
              </Link>
            </p>
          </Section>
        </div>
      </div>

      {/* Under the photos on a big screen; after the button on a phone. */}
      <ul className="grid gap-3 sm:grid-cols-3 lg:-mt-2">
        {features.map((f) => (
          <li key={f.title} className="flex sm:flex-col items-center sm:items-stretch gap-3 bg-navy rounded-xl overflow-hidden">
            <Image
              src={f.image}
              alt=""
              width={88}
              height={88}
              className="flex-none w-20 h-20 sm:w-full sm:h-20 object-cover"
            />
            <div className="py-3 pr-3 sm:px-4 sm:pt-0 sm:pb-4">
              <p className="font-semibold text-sm">{f.title}</p>
              <p className="text-ink/55 text-xs mt-1">{f.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
