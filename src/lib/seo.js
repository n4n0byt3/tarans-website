import { siteConfig } from "./site-config";
import { products, gallery, oilDescription, PRODUCT, BOTTLE_SIZE } from "./products";
import { formatPrice } from "./format";

// Everything here describes the shop to machines — search engines through
// schema.org structured data, AI assistants through /llms.txt. It is built
// from the same catalogue and config the pages render, so a price or policy
// change can't leave a stale copy behind.

const absolute = (path) => `${siteConfig.url}${path}`;
const money = (cents) => (cents / 100).toFixed(2);
const currency = siteConfig.currency.toUpperCase();

export function lowestPriceCents() {
  return Math.min(...products.map((p) => p.priceCents));
}

// Search results cut descriptions off at roughly 155 characters, so these
// lead with what's on offer, then the reason to trust it.
export function siteDescription() {
  return (
    `Grooming without the routine. Pre-order ${siteConfig.brandName} beard oil, the first drop: ` +
    `softens coarse hair and calms itch. From ${formatPrice(lowestPriceCents())}.`
  );
}

export function productDescription() {
  return (
    `Pre-order ${siteConfig.brandName} beard oil (${BOTTLE_SIZE}): softens coarse hair and calms itch. ` +
    `1, 2 or 3 bottles from ${formatPrice(lowestPriceCents())}. Cancel any time before it ships.`
  );
}

function shippingDetails() {
  return {
    "@type": "OfferShippingDetails",
    shippingRate: {
      "@type": "MonetaryAmount",
      value: money(siteConfig.flatShippingCents),
      currency,
    },
    shippingDestination: {
      "@type": "DefinedRegion",
      addressCountry: siteConfig.shipsToCode,
    },
    // No handling time: it's a pre-order and the dispatch date isn't set.
    // Only the courier's transit time is known.
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      transitTime: {
        "@type": "QuantitativeValue",
        minValue: siteConfig.transit.min,
        maxValue: siteConfig.transit.max,
        unitCode: "DAY",
      },
    },
  };
}

// Mirrors /returns: 30 days, sent back by post, customer pays return postage
// unless the item was faulty.
function returnPolicy() {
  return {
    "@type": "MerchantReturnPolicy",
    applicableCountry: siteConfig.shipsToCode,
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: siteConfig.guaranteeDays,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/ReturnShippingFees",
  };
}

// One product (the oil) with an offer per pack size.
export function productSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${siteConfig.brandName} Beard Oil`,
    description: oilDescription,
    category: "Health & Beauty > Personal Care > Shaving & Grooming > Beard Oil",
    image: gallery.map((g) => absolute(g.src)),
    brand: { "@type": "Brand", name: siteConfig.brandName },
    size: BOTTLE_SIZE,
    offers: products.map((p) => ({
      "@type": "Offer",
      name: p.name,
      sku: p.slug,
      url: absolute(PRODUCT.path),
      priceCurrency: currency,
      price: money(p.priceCents),
      availability: "https://schema.org/PreOrder",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: siteConfig.brandName },
      shippingDetails: shippingDetails(),
      hasMerchantReturnPolicy: returnPolicy(),
    })),
  };
}

export function breadcrumbSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Beard care", item: absolute("/#shop") },
      { "@type": "ListItem", position: 3, name: "Beard oil", item: absolute(PRODUCT.path) },
    ],
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.brandName,
    url: siteConfig.url,
    // A raster logo: Google's logo guidelines don't reliably accept SVG.
    logo: absolute("/apple-icon.png"),
    email: siteConfig.supportEmail,
    sameAs: [siteConfig.instagram, siteConfig.tiktok].filter(Boolean),
  };
}

// Lets Google show "AZAD BLACK" as the site name in results instead of the URL.
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.brandName,
    url: siteConfig.url,
  };
}

export function faqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.text },
    })),
  };
}

// JSON-LD sits inside a <script> tag. Escaping "<" stops any text in the
// data (a product name, an FAQ answer) from closing that tag early.
export function jsonLd(data) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
