import Link from "next/link";
import { siteConfig, shipStatus } from "@/lib/site-config";
import { formatPrice } from "@/lib/format";

// Shown above checkout in the basket, so the pre-order terms, delivery and
// returns are a tap away right where the decision gets made.
export default function PurchaseReassurance({ onNavigate, className = "" }) {
  const linkClass = "text-teal hover:underline";

  return (
    <ul className={`text-xs text-ink/60 space-y-1.5 ${className}`}>
      <li>
        <span className="text-ink/80">Pre-order.</span> {shipStatus()} Cancel any time before it
        ships for a full refund.
      </li>
      <li>
        {formatPrice(siteConfig.flatShippingCents)} UK delivery, free over{" "}
        {formatPrice(siteConfig.freeShippingThresholdCents)}.{" "}
        <Link href="/shipping" className={linkClass} onClick={onNavigate}>
          Delivery
        </Link>
      </li>
      <li>
        {siteConfig.guaranteeDays}-day money-back guarantee once it arrives, even if opened.{" "}
        <Link href="/returns" className={linkClass} onClick={onNavigate}>
          Returns
        </Link>
      </li>
      <li>Secure card payment by Stripe — we never see your card details.</li>
    </ul>
  );
}
