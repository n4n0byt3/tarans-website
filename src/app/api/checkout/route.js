import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { getProduct } from "@/lib/products";
import { siteConfig, shipStatus } from "@/lib/site-config";
import { readRememberedOffer } from "@/lib/offer";

// Prices always come from our own product catalog, never from the client —
// otherwise a tampered request could check out at an arbitrary price.
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const requestedItems = Array.isArray(body?.items) ? body.items : [];
  if (requestedItems.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const lineItems = [];
  let subtotalCents = 0;

  for (const requested of requestedItems) {
    const product = getProduct(requested?.slug);
    const quantity = Number(requested?.quantity);
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      return NextResponse.json(
        { error: "Cart contains an invalid item" },
        { status: 400 }
      );
    }
    subtotalCents += product.priceCents * quantity;
    lineItems.push({
      quantity,
      price_data: {
        currency: siteConfig.currency,
        unit_amount: product.priceCents,
        product_data: { name: `${siteConfig.brandName} Beard Oil — ${product.name}` },
      },
    });
  }

  const freeShipping = subtotalCents >= siteConfig.freeShippingThresholdCents;

  const origin =
    request.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    new URL(request.url).origin;

  const baseParams = {
    mode: "payment",
    line_items: lineItems,
    shipping_address_collection: { allowed_countries: [siteConfig.shipsToCode] },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: freeShipping ? 0 : siteConfig.flatShippingCents,
            currency: siteConfig.currency,
          },
          display_name: freeShipping ? "Free delivery" : "UK delivery",
        },
      },
    ],
    // Shown beside the pay button, so the pre-order terms are in front of the
    // customer at the moment they commit.
    custom_text: {
      submit: {
        message: `This is a pre-order. ${shipStatus()} Cancel any time before it ships for a full refund.`,
      },
    },
    metadata: { preorder: "true" },
    payment_intent_data: { metadata: { preorder: "true" } },
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cancel`,
  };

  // Stripe accepts either a discount applied up front or a box for the
  // customer to type a code — not both.
  const remembered = await readRememberedOffer();
  const withOffer = remembered
    ? { ...baseParams, discounts: [{ promotion_code: remembered.promoId }] }
    : { ...baseParams, allow_promotion_codes: true };

  try {
    const stripe = getStripeClient();
    let session;
    try {
      session = await stripe.checkout.sessions.create(withOffer);
    } catch (err) {
      // The remembered code has already been used, or expired in the gap
      // since the page loaded. Carry on without it rather than block the
      // order; the customer can still type a code.
      if (!remembered || !String(err?.param || "").startsWith("discounts")) throw err;
      session = await stripe.checkout.sessions.create({
        ...baseParams,
        allow_promotion_codes: true,
      });
    }

    return NextResponse.json({
      url: session.url,
      discountApplied: (session.total_details?.amount_discount ?? 0) > 0,
    });
  } catch (err) {
    console.error("Stripe checkout session error:", err);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 }
    );
  }
}
