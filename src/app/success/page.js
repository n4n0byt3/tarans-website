import Link from "next/link";
import ClearCartOnLoad from "@/components/ClearCartOnLoad";
import { getStripeClient } from "@/lib/stripe";
import { orderNumberFromSession } from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import { siteConfig, shipStatus } from "@/lib/site-config";

export const metadata = {
  title: "Pre-order confirmed",
  robots: { index: false, follow: false },
};

async function getPaidOrder(sessionId) {
  if (!sessionId) return null;
  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });
    if (session.payment_status !== "paid") return null;
    return {
      orderNumber: orderNumberFromSession(session.id),
      email: session.customer_details?.email || null,
      totalCents: session.amount_total,
      items: (session.line_items?.data || []).map((li) => ({
        name: li.description,
        quantity: li.quantity,
        amountCents: li.amount_total,
      })),
    };
  } catch {
    return null;
  }
}

const buttonClass =
  "inline-block mt-8 bg-ink text-cream rounded-full px-6 py-3 font-semibold transition-all duration-200 hover:opacity-85 active:scale-95";

export default async function SuccessPage({ searchParams }) {
  const { session_id: sessionId } = await searchParams;
  const order = await getPaidOrder(sessionId);

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <h1 className="text-3xl font-bold">We couldn&apos;t confirm that order</h1>
        <p className="text-ink/70 mt-4">
          We&apos;re not able to verify a completed payment for this link. If you
          just placed an order and were charged, check your email for a
          receipt, or contact us at{" "}
          <a href={`mailto:${siteConfig.supportEmail}`} className="text-teal hover:underline">
            {siteConfig.supportEmail}
          </a>
          .
        </p>
        <Link href="/" className={buttonClass}>
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-5 py-24">
      <ClearCartOnLoad />
      <div className="text-center">
        <p className="text-teal text-xs font-semibold uppercase tracking-widest">
          Pre-order confirmed
        </p>
        <h1 className="text-3xl font-bold mt-3">You&apos;re one of the first.</h1>
        <p className="text-ink/70 mt-4">
          Thanks for backing the first {siteConfig.brandName} drop
          {order.email ? (
            <>
              {" "}— a confirmation is on its way to{" "}
              <span className="text-ink">{order.email}</span>.
            </>
          ) : (
            "."
          )}
        </p>
      </div>

      <ol className="mt-8 space-y-3 text-sm text-ink/70">
        <li>
          <span className="text-ink font-semibold">Ship date:</span> {shipStatus()}
        </li>
        <li>
          <span className="text-ink font-semibold">Delivery:</span> we&apos;ll email you when
          it&apos;s out for delivery; it arrives {siteConfig.transitText} after that.
        </li>
        <li>
          <span className="text-ink font-semibold">Changed your mind?</span> Reply to your
          confirmation email any time before it ships for a full refund.
        </li>
      </ol>

      <div className="mt-10 bg-navy border border-ink/10 rounded-2xl p-6">
        <p className="text-ink/50 text-xs uppercase tracking-wide">Order reference</p>
        <p className="font-semibold text-lg mt-1">{order.orderNumber}</p>
        <ul className="mt-5 space-y-2 text-sm">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between gap-4 text-ink/70">
              <span>
                {item.quantity} &times; {item.name}
              </span>
              <span>{formatPrice(item.amountCents)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between font-semibold mt-4 pt-4 border-t border-ink/10">
          <span>Total paid</span>
          <span>{formatPrice(order.totalCents)}</span>
        </div>
        <p className="text-ink/40 text-xs mt-4">
          Includes delivery and any discount. Keep the reference handy if you need to get in touch.
        </p>
      </div>

      <div className="text-center">
        <Link href="/" className={buttonClass}>
          Back to shop
        </Link>
      </div>
    </div>
  );
}
