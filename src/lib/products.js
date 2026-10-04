import { siteConfig } from "./site-config";
import { formatPrice } from "./format";

// Private-label beard oil from Guangzhou Biying Cosmetics Co., Ltd. (their
// own brand is MOOYAM), relabelled as AZAD BLACK in a 30ml dropper bottle.
// Listed at £0.31-0.37/unit before customisation and shipping, MOQ 3.
// Sold as quantity tiers.

// The INCI ingredient list, exactly as it appears on the bottle. Every
// tier is the same oil, so it lives here once. A UK cosmetic has to carry
// this on the label, and buyers with allergies need it before they order.
// The supplier listing only gives the category "Herbal", not the actual
// ingredients — ask Guangzhou Biying for the INCI list and paste it in.
// Until then the product pages say it's available on request rather than
// invent one.
export const ingredientsInci = "";

// Product facts from the supplier's listing. Deliberately leaves out the
// listing's own marketing ("accelerates hair regrowth", "eliminates
// dandruff"): growth claims make a product a medicine in UK law, and the
// rest is stronger than a cosmetic can claim without evidence.
export const productDetails = [
  { label: "Scent", value: "Fresh, natural" },
  { label: "Suitable for", value: "All skin types, adults" },
  { label: "Finish", value: "Light shine, no hold" },
  { label: "Shelf life", value: "3 years unopened" },
];

// The oil itself, independent of pack size.
export const oilDescription =
  "A lightweight, fast-absorbing beard oil that softens coarse hair and calms the itch and flakiness of growing out a beard.";

// What the oil does, stated as a cosmetic can honestly state it. The
// supplier's own listing calls it a "growth oil"; this deliberately doesn't.
export const oilBenefits = [
  "Softens coarse, wiry hair",
  "Calms the itch and the flakes underneath",
  "A light shine — no hold, no stiffness",
  "Fresh, natural scent",
];

// The one place the bottle size is set — every label, title and supply
// estimate on the site reads it from here.
export const BOTTLE_SIZE = "30ml";

const SINGLE_BOTTLE_CENTS = 1399;

// A struck-through reference price has to be a genuine price or it's a
// misleading saving under UK pricing law. The honest reference for a pack
// is what the same number of single bottles costs, so it's derived from the
// single-bottle price rather than typed in, and can't drift from it.
function packPricing(bottles, priceCents) {
  const compareAtCents = bottles * SINGLE_BOTTLE_CENTS;
  return {
    compareAtCents,
    discountPercent: Math.floor(((compareAtCents - priceCents) / compareAtCents) * 100),
    savingCents: compareAtCents - priceCents,
  };
}

// Kept in step with checkout: no single pack clears the free-delivery
// threshold on its own, so none of them can promise free delivery outright.
function deliveryBullet(priceCents) {
  return priceCents >= siteConfig.freeShippingThresholdCents
    ? "Free UK delivery"
    : `Free UK delivery over ${formatPrice(siteConfig.freeShippingThresholdCents)}`;
}

// The packs. Every one is the same oil; only the number of bottles differs.
// `slug` is what the basket and checkout use to identify a pack.
export const products = [
  {
    slug: "one-bottle",
    name: "1 Bottle",
    bottles: 1,
    scent: `${BOTTLE_SIZE} beard oil`,
    priceCents: SINGLE_BOTTLE_CENTS,
    image: "/products/qty-1.png",
    description:
      "Your first bottle. Lightweight, fast-absorbing oil that softens coarse hair and calms the itch and flakiness of the first few weeks of growing out.",
    bullets: [
      `${BOTTLE_SIZE} — lasts around 2 months`,
      "Non-greasy, fast-absorbing",
      "Softens & tames flyaways",
      deliveryBullet(SINGLE_BOTTLE_CENTS),
    ],
  },
  {
    slug: "two-bottles",
    name: "2 Bottles",
    bottles: 2,
    scent: `2 x ${BOTTLE_SIZE} beard oil`,
    priceCents: 2299,
    ...packPricing(2, 2299),
    image: "/products/qty-2.png",
    description:
      "Stock up and never run out. Two bottles at a lower price per bottle than buying one at a time.",
    bullets: [
      `2 x ${BOTTLE_SIZE} — around 4 months' supply`,
      "Lower price per bottle",
      "Non-greasy, fast-absorbing",
      deliveryBullet(2299),
    ],
  },
  {
    slug: "three-bottles",
    name: "3 Bottles",
    bottles: 3,
    scent: `3 x ${BOTTLE_SIZE} beard oil`,
    priceCents: 3199,
    ...packPricing(3, 3199),
    image: "/products/qty-3.png",
    isBestValue: true,
    description:
      "Our best value pack. Around six months' supply for you, or share the extras — the best way to buy.",
    bullets: [
      `3 x ${BOTTLE_SIZE} — around 6 months' supply`,
      "Best price per bottle",
      "Great gift option",
      deliveryBullet(3199),
    ],
  },
];

export function getProduct(slug) {
  return products.find((p) => p.slug === slug);
}
