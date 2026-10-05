import { products, ingredientsInci, oilBenefits, oilDescription, productDetails, PRODUCT, BOTTLE_SIZE } from "@/lib/products";
import { siteConfig, shipStatus } from "@/lib/site-config";
import { formatPrice } from "@/lib/format";
import { siteDescription } from "@/lib/seo";
import { faqs } from "@/lib/faqs";

// /llms.txt — a plain markdown summary of the shop for AI assistants and
// other automated readers (see llmstxt.org). Generated from the same
// catalogue, config and FAQ as the pages at build time, so prices, dates
// and policies here can't fall out of date.
//
// Deliberately limited to facts the site states elsewhere. Anything put here
// gets repeated by AI tools as fact, so unverified claims stay out.

export const dynamic = "force-static";

function buildLlmsTxt() {
  const url = (path) => `${siteConfig.url}${path}`;
  const { percentOff, validHours } = siteConfig.offer;

  const packLines = products.map((p) => {
    const perBottle = formatPrice(Math.round(p.priceCents / p.bottles));
    const saving =
      p.savingCents > 0
        ? ` Saves ${formatPrice(p.savingCents)} compared with ${p.bottles} single bottles.`
        : "";
    return `- ${p.name} (${p.scent}): ${formatPrice(p.priceCents)}, ${perBottle} per bottle.${saving}`;
  });

  const socials = [
    siteConfig.instagram && `- [Instagram](${siteConfig.instagram})`,
    siteConfig.tiktok && `- [TikTok](${siteConfig.tiktok})`,
  ].filter(Boolean);

  return `# ${siteConfig.brandName}

> ${siteDescription()}

${siteConfig.brandName} is a new men's grooming brand built around one idea: ${siteConfig.tagline.toLowerCase().replace(/\.$/, "")}. ${siteConfig.description}

It is at the very start. Its first and only product is a beard oil, currently available to pre-order. It is a cosmetic for external use on facial hair and the skin beneath it, not a medicine, and it does not make a beard grow.

## The first product: beard oil

[${siteConfig.brandName} Beard Oil](${url(PRODUCT.path)}) — ${BOTTLE_SIZE} dropper bottle, around two months of daily use.

${oilDescription}

${oilBenefits.map((b) => `- ${b}`).join("\n")}
${productDetails.map((d) => `- ${d.label}: ${d.value}`).join("\n")}

Packs (every pack is the same oil):

${packLines.join("\n")}

Ingredients: ${
    ingredientsInci ||
    `the full ingredient list will be printed on the bottle and is available on request from ${siteConfig.supportEmail}.`
  }

## Pre-ordering

- It is a pre-order: customers pay when they order and everyone's order ships together once stock arrives.
- ${shipStatus()}
- A pre-order can be cancelled any time before it ships, for a full refund including delivery.
- Customers are emailed an order confirmation, the confirmed ship date, and again when the order is out for delivery.
- Signing up with an email address unlocks ${percentOff}% off a pre-order. The code is single use and valid for ${validHours} hours, one per email address.

## Delivery and returns

- Delivery to the ${siteConfig.shipsTo} only: ${formatPrice(siteConfig.flatShippingCents)}, free on orders over ${formatPrice(siteConfig.freeShippingThresholdCents)}. It arrives ${siteConfig.transitText} after dispatch.
- ${siteConfig.guaranteeDays}-day money-back guarantee after delivery, including on opened bottles.
- Payment is by card through Stripe's hosted checkout; ${siteConfig.brandName} never sees card details.

## FAQ

${faqs.map((f) => `### ${f.q}\n\n${f.text}`).join("\n\n")}

## Policies

- [Delivery & shipping](${url("/shipping")})
- [Returns & refunds](${url("/returns")})
- [Terms & conditions](${url("/terms")})
- [Privacy policy](${url("/privacy")})

## Contact

- Email: ${siteConfig.supportEmail}
${socials.join("\n")}
`;
}

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
