const FALLBACK_SITE_URL = "https://azadblack.co.uk";

// NEXT_PUBLIC_SITE_URL is typed by hand into a hosting dashboard, so it
// regularly arrives as a bare domain or with a stray slash. Left as-is that
// crashes `new URL()` in layout.js and takes the whole build down, so
// normalise it here rather than trusting it.
function resolveSiteUrl(value) {
  const trimmed = (value || "").trim();
  if (!trimmed) return FALLBACK_SITE_URL;

  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    return new URL(withScheme).origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}

// Brand details — this is the only place most copy needs to change.
export const siteConfig = {
  // Used for canonical URLs, sitemap and social share links. Set
  // NEXT_PUBLIC_SITE_URL in the hosting environment to the live domain.
  url: resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  brandName: "AZAD BLACK",
  // The one problem the brand exists to solve — leads the homepage.
  tagline: "Grooming shouldn't feel like another job.",
  // The philosophy, in five words.
  description: "Simple rituals. Better results. Less effort.",
  guaranteeDays: 30,
  supportEmail: "hello@azadblack.co.uk",

  // Social links are optional — the footer hides any that are left empty.
  // A link to instagram.com rather than an actual profile reads as fake, so
  // only ever put a real profile URL here.
  instagram: "https://www.instagram.com/azadblack_/",
  tiktok: "https://www.tiktok.com/@azadblack_",

  currency: "gbp",
  freeShippingThresholdCents: 3500,
  flatShippingCents: 399,
  // PRE-ORDER. The first drop is sold before stock arrives. When the
  // supplier confirms timing, set shipEstimate to how it should read after
  // "Expected to ship", e.g. "in early December 2026" or "within 4–6 weeks of
  // ordering", and every page, email and checkout note updates. While it's
  // null they all say the date is still to be confirmed.
  //
  // UK law: with no agreed date, delivery is due within 30 days of the
  // order, after which the customer can cancel. The site therefore offers a
  // full refund any time before dispatch.
  preorder: {
    open: true,
    shipEstimate: null,
  },

  // Business days from dispatch to the door. Search engines read these as
  // numbers from the structured data; page wording is built from them too.
  transit: { min: 2, max: 4 },
  shipsTo: "United Kingdom",
  shipsToCode: "GB",

  // The email-capture offer, revealed by the scratch card. Each email gets
  // its own single-use Stripe code that expires validHours after it's
  // issued. Change the numbers here; the Stripe coupon is created to match
  // on first use (a new couponId is needed if percentOff changes, because
  // Stripe coupons can't be edited).
  offer: {
    percentOff: 10,
    validHours: 24,
    couponId: "first-drop-10",
    codePrefix: "AZAD",
  },

  // What search results show. Kept separate from the on-page headline so it
  // can name the product and the pre-order.
  seoTitle: "AZAD BLACK Beard Oil — Pre-order the First Drop",

  // TRADER DETAILS — legally required on a UK selling site, and the legal
  // pages render these verbatim. Replace every "TODO" before launch.
  business: {
    legalName: "TODO: registered company name, or your own name if a sole trader",
    addressLines: [
      "TODO: first line of your business address",
      "TODO: town/city",
      "TODO: postcode",
      "United Kingdom",
    ],
    // Leave blank if trading as a sole trader rather than a limited company.
    companyNumber: "",
    vatNumber: "",
    // The person or company legally accountable for the cosmetic product in
    // the UK. Required by the UK Cosmetics Regulation. See COMPLIANCE.md.
    responsiblePerson: "TODO: name of the UK Responsible Person",
  },
};

siteConfig.transitText = `${siteConfig.transit.min}–${siteConfig.transit.max} business days`;

// One sentence used everywhere the ship date comes up, so the product page,
// basket, checkout, emails and FAQ always say the same thing.
export function shipStatus() {
  const estimate = siteConfig.preorder.shipEstimate;
  return estimate
    ? `Expected to ship ${estimate}.`
    : "Ship date to be confirmed — we'll email you as soon as it's set.";
}

// True once the trader details above have actually been filled in.
export function hasTraderDetails() {
  const { legalName, addressLines } = siteConfig.business;
  return (
    !legalName.startsWith("TODO") &&
    !addressLines.some((line) => line.startsWith("TODO"))
  );
}
