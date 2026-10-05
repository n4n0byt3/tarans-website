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

// The product as the shop presents it: one beard oil, bought in packs of
// one, two or three bottles.
export const PRODUCT = {
  name: "Beard Oil",
  path: "/beard-oil",
  // Labelled AZAD BLACK bottle, cut from the brand's product mock-up.
  image: { src: "/products/beard-oil.png", width: 613, height: 603 },
  // Three words under the name. No "grow": growth claims make a cosmetic a
  // medicine in UK law.
  keywords: ["Nourish", "Soften", "Shine"],
};

// The icon row on the product page. Each is one of oilBenefits, shortened.
export const highlights = [
  { icon: "drop", label: "Moisturises & softens" },
  { icon: "shield", label: "Reduces dryness & itch" },
  { icon: "feather", label: "Light & non-greasy" },
  { icon: "leaf", label: "Fresh, natural scent" },
];

// The three tiles under the product photos. Deliberately nothing about
// specific oils: the ingredient list isn't confirmed yet.
export const features = [
  {
    image: "/products/feature-oil.png",
    title: "Lightweight oil blend",
    body: "Absorbs quickly, no oily residue.",
  },
  {
    image: "/products/feature-dropper.png",
    title: "A few drops a day",
    body: "About thirty seconds, once a day.",
  },
  {
    image: "/products/feature-texture.png",
    title: "Softer, neater beard",
    body: "Tames frizz and flyaways.",
  },
];

export const howToUse = [
  "Apply — a few drops into your palm. Rub your hands together.",
  "Shape — work it through your beard, down to the skin. Fingers or a comb.",
  "Go — that's it. About thirty seconds, once a day.",
];

const SINGLE_BOTTLE_CENTS = 1399;

// A struck-through reference price has to be a genuine price or it's a
// misleading saving under UK pricing law. The honest reference for a pack
// is what the same number of single bottles costs, so it's derived from the
// single-bottle price rather than typed in, and can't drift from it.
function packPricing(bottles, priceCents) {
  const compareAtCents = bottles * SINGLE_BOTTLE_CENTS;
  return { compareAtCents, savingCents: compareAtCents - priceCents };
}

// The packs — the options on the product page. Every one is the same oil;
// only the number of bottles differs. `slug` is what the basket and
// checkout use to identify a pack. A bottle lasts around two months.
export const products = [
  {
    slug: "one-bottle",
    name: "1 Bottle",
    bottles: 1,
    scent: `${BOTTLE_SIZE} beard oil`,
    supply: "around 2 months",
    priceCents: SINGLE_BOTTLE_CENTS,
    image: "/products/qty-1.png",
  },
  {
    slug: "two-bottles",
    name: "2 Bottles",
    bottles: 2,
    scent: `2 x ${BOTTLE_SIZE} beard oil`,
    supply: "around 4 months",
    priceCents: 2299,
    ...packPricing(2, 2299),
    image: "/products/qty-2.png",
  },
  {
    slug: "three-bottles",
    name: "3 Bottles",
    bottles: 3,
    scent: `3 x ${BOTTLE_SIZE} beard oil`,
    supply: "around 6 months",
    priceCents: 3199,
    ...packPricing(3, 3199),
    image: "/products/qty-3.png",
    isBestValue: true,
  },
];

export function getProduct(slug) {
  return products.find((p) => p.slug === slug);
}
