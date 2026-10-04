import { Resend } from "resend";
import { siteConfig, shipStatus } from "./site-config";
import { formatPrice } from "./format";

// Until a domain is verified in Resend, EMAIL_FROM falls back to Resend's
// shared test sender, which can only deliver to the account owner's address.
// See README "Sending order emails" for the DNS steps.
const FROM = process.env.EMAIL_FROM || "AZAD BLACK <onboarding@resend.dev>";
const OWNER_EMAIL = process.env.OWNER_EMAIL || siteConfig.supportEmail;

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

// Every value below that came from a customer or from the admin form —
// names, addresses, tracking numbers — is escaped. Otherwise someone could
// type markup into their delivery address and have it render inside the
// owner's new-order email.
function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Email clients are unreliable with modern CSS, so these templates stay on
// inline styles and simple markup.
function layout(bodyHtml) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#16130f;font-family:Helvetica,Arial,sans-serif;color:#efe8e0;">
    <div style="max-width:520px;margin:0 auto;background:#221d18;border-radius:16px;padding:32px;">
      <h1 style="margin:0 0 24px;font-size:20px;letter-spacing:1px;color:#efe8e0;">${escapeHtml(siteConfig.brandName)}</h1>
      ${bodyHtml}
      <p style="margin:32px 0 0;font-size:12px;color:rgba(239,232,224,0.5);">
        Questions? Just reply to this email or contact us at ${escapeHtml(siteConfig.supportEmail)}.
      </p>
    </div>
  </body>
</html>`;
}

function itemsTable(items, totalCents) {
  const rows = items
    .map(
      (item) =>
        `<tr>
          <td style="padding:6px 0;color:rgba(239,232,224,0.8);">${escapeHtml(item.quantity)} &times; ${escapeHtml(item.name)}</td>
          <td style="padding:6px 0;text-align:right;color:rgba(239,232,224,0.8);">${formatPrice(item.amountCents)}</td>
        </tr>`
    )
    .join("");

  return `<table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
    ${rows}
    <tr>
      <td style="padding:12px 0 0;border-top:1px solid rgba(239,232,224,0.15);font-weight:bold;">Total</td>
      <td style="padding:12px 0 0;border-top:1px solid rgba(239,232,224,0.15);text-align:right;font-weight:bold;">${formatPrice(totalCents)}</td>
    </tr>
  </table>`;
}

// Resend drops a repeat send with the same idempotency key, so a webhook that
// Stripe delivers twice still only produces one email.
function sendOptions(idempotencyKey) {
  return idempotencyKey ? { idempotencyKey } : undefined;
}

export async function sendOrderConfirmation({ to, orderNumber, items, totalCents, idempotencyKey }) {
  const resend = getResend();
  if (!resend || !to) return { skipped: true };

  return resend.emails.send(
    {
      from: FROM,
      to,
      subject: `Order confirmed — ${orderNumber}`,
      html: layout(`
        <p style="margin:0 0 16px;font-size:18px;font-weight:bold;">Your pre-order is confirmed.</p>
        <p style="margin:0 0 16px;color:rgba(239,232,224,0.7);line-height:1.6;">
          Thanks for backing the first ${escapeHtml(siteConfig.brandName)} drop. You're one of the first
          people to get it.
        </p>
        <p style="margin:0 0 24px;color:rgba(239,232,224,0.7);line-height:1.6;">
          <strong style="color:#e2a582;">${escapeHtml(shipStatus())}</strong> We'll email you again when
          it's out for delivery.
        </p>
        ${itemsTable(items, totalCents)}
        <p style="margin:0 0 16px;font-size:13px;color:rgba(239,232,224,0.6);line-height:1.6;">
          Changed your mind? Reply to this email any time before it ships and we'll refund you in full.
        </p>
        <p style="margin:0;font-size:13px;color:rgba(239,232,224,0.5);">Order reference: ${escapeHtml(orderNumber)}</p>
      `),
    },
    sendOptions(idempotencyKey)
  );
}

export async function sendOutForDelivery({ to, orderNumber, trackingNumber, trackingUrl, idempotencyKey }) {
  const resend = getResend();
  if (!resend || !to) return { skipped: true };

  let tracking = "";
  if (trackingNumber || trackingUrl) {
    tracking = `<p style="margin:0 0 24px;color:rgba(239,232,224,0.7);line-height:1.6;">
      ${trackingNumber ? `Tracking number: <strong style="color:#efe8e0;">${escapeHtml(trackingNumber)}</strong><br/>` : ""}
      ${
        trackingUrl
          ? `<a href="${escapeHtml(trackingUrl)}" style="display:inline-block;margin-top:12px;background:#efe8e0;color:#16130f;padding:10px 20px;border-radius:999px;text-decoration:none;font-weight:bold;">Track your parcel</a>`
          : ""
      }
    </p>`;
  }

  return resend.emails.send(
    {
      from: FROM,
      to,
      subject: `Your order is out for delivery — ${orderNumber}`,
      html: layout(`
        <p style="margin:0 0 16px;font-size:18px;font-weight:bold;">Your order is out for delivery.</p>
        <p style="margin:0 0 24px;color:rgba(239,232,224,0.7);line-height:1.6;">
          Good news — your ${escapeHtml(siteConfig.brandName)} order has left us and is on its way to you.
          It should arrive in the next few days.
        </p>
        ${tracking}
        <p style="margin:0;font-size:13px;color:rgba(239,232,224,0.5);">Order reference: ${escapeHtml(orderNumber)}</p>
      `),
    },
    sendOptions(idempotencyKey)
  );
}

export async function sendOwnerNewOrder({ orderNumber, items, totalCents, customerEmail, shipping, idempotencyKey }) {
  const resend = getResend();
  if (!resend) return { skipped: true };

  const address = shipping
    ? [shipping.line1, shipping.line2, shipping.city, shipping.postal_code, shipping.country]
        .filter(Boolean)
        .join(", ")
    : "No address collected";

  return resend.emails.send(
    {
      from: FROM,
      to: OWNER_EMAIL,
      subject: `New pre-order ${orderNumber} — ${formatPrice(totalCents)}`,
      html: layout(`
        <p style="margin:0 0 16px;font-size:18px;font-weight:bold;">New pre-order received.</p>
        ${itemsTable(items, totalCents)}
        <p style="margin:0 0 6px;color:rgba(239,232,224,0.7);"><strong>Ship to:</strong> ${escapeHtml(address)}</p>
        <p style="margin:0 0 6px;color:rgba(239,232,224,0.7);"><strong>Customer:</strong> ${escapeHtml(customerEmail || "unknown")}</p>
        <p style="margin:16px 0 0;font-size:13px;color:rgba(239,232,224,0.5);">
          When stock arrives, post the parcel and mark it as out for delivery at ${escapeHtml(siteConfig.url)}/admin
        </p>
      `),
    },
    sendOptions(idempotencyKey)
  );
}

const LONDON_TIME = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export async function sendOfferEmail({ to, code, percentOff, expiresAt }) {
  const resend = getResend();
  if (!resend || !to) return { skipped: true };

  return resend.emails.send(
    {
      from: FROM,
      to,
      subject: `Your ${percentOff}% off the first ${siteConfig.brandName} drop`,
      html: layout(`
        <p style="margin:0 0 16px;font-size:18px;font-weight:bold;">Your discount is unlocked.</p>
        <p style="margin:0 0 20px;color:rgba(239,232,224,0.7);line-height:1.6;">
          ${percentOff}% off when you pre-order the first ${escapeHtml(siteConfig.brandName)} drop.
        </p>
        <p style="margin:0 0 8px;font-size:13px;color:rgba(239,232,224,0.5);">Your code</p>
        <p style="margin:0 0 20px;font-size:24px;font-weight:bold;letter-spacing:2px;color:#e2a582;">${escapeHtml(code)}</p>
        <p style="margin:0 0 24px;color:rgba(239,232,224,0.7);line-height:1.6;">
          It's single use and valid until <strong style="color:#efe8e0;">${escapeHtml(LONDON_TIME.format(expiresAt))}</strong>
          (UK time). On the device you signed up on it's applied automatically at checkout;
          anywhere else, enter the code at checkout.
        </p>
        <a href="${escapeHtml(siteConfig.url)}/#shop" style="display:inline-block;background:#efe8e0;color:#16130f;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:bold;">Pre-order the first drop</a>
        <p style="margin:28px 0 0;font-size:12px;color:rgba(239,232,224,0.45);line-height:1.6;">
          You're getting this because you signed up at ${escapeHtml(siteConfig.url)}. We'll send the
          occasional update as we build the brand — reply "unsubscribe" and we'll take you off the list.
        </p>
      `),
    },
    sendOptions(`offer/${code}`)
  );
}

export async function sendShipDateEmail({ to, orderNumber, shipDate, idempotencyKey }) {
  const resend = getResend();
  if (!resend || !to) return { skipped: true };

  return resend.emails.send(
    {
      from: FROM,
      to,
      subject: `Your pre-order has a ship date — ${orderNumber}`,
      html: layout(`
        <p style="margin:0 0 16px;font-size:18px;font-weight:bold;">We've got a ship date.</p>
        <p style="margin:0 0 24px;color:rgba(239,232,224,0.7);line-height:1.6;">
          Your ${escapeHtml(siteConfig.brandName)} pre-order is expected to ship
          <strong style="color:#e2a582;">${escapeHtml(shipDate)}</strong>. We'll email you again the moment
          it's out for delivery.
        </p>
        <p style="margin:0 0 16px;font-size:13px;color:rgba(239,232,224,0.6);line-height:1.6;">
          Not going to work for you? Reply before it ships and we'll refund you in full.
        </p>
        <p style="margin:0;font-size:13px;color:rgba(239,232,224,0.5);">Order reference: ${escapeHtml(orderNumber)}</p>
      `),
    },
    sendOptions(idempotencyKey)
  );
}

// Saves a sign-up as a Resend contact, so the owner can email the list later
// with Resend Broadcasts (which handle unsubscribes). An address that's
// already a contact is not an error worth surfacing.
export async function addToAudience(email) {
  const resend = getResend();
  if (!resend) return { skipped: true };
  return resend.contacts.create({ email, unsubscribed: false });
}
