import Link from "next/link";
import { siteConfig, hasTraderDetails } from "@/lib/site-config";
import Logo from "./Logo";

const socials = [
  { label: "Instagram", href: siteConfig.instagram },
  { label: "TikTok", href: siteConfig.tiktok },
];

export default function Footer() {
  // A social link pointing at instagram.com rather than a real profile looks
  // like a fake shop, so an unset one is simply not rendered.
  const activeSocials = socials.filter((s) => s.href);

  return (
    <footer className="bg-navy text-ink mt-24">
      <div className="mx-auto max-w-6xl px-5 py-14 grid gap-10 sm:grid-cols-4">
        <div>
          <Logo className="h-9" />
          <p className="text-ink/70 text-sm mt-3 max-w-xs">
            {siteConfig.description}
          </p>
        </div>

        <div className="text-sm">
          <p className="font-semibold mb-3">Shop</p>
          <ul className="space-y-2 text-ink/70">
            <li>
              <Link href="/#shop" className="hover:text-teal transition-colors">
                All products
              </Link>
            </li>
            <li>
              <Link href="/#faq" className="hover:text-teal transition-colors">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-sm">
          <p className="font-semibold mb-3">Help</p>
          <ul className="space-y-2 text-ink/70">
            <li>
              <Link href="/shipping" className="hover:text-teal transition-colors">
                Delivery
              </Link>
            </li>
            <li>
              <Link href="/returns" className="hover:text-teal transition-colors">
                Returns & refunds
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-teal transition-colors">
                Terms & conditions
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-teal transition-colors">
                Privacy policy
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-sm">
          <p className="font-semibold mb-3">Get in touch</p>
          <ul className="space-y-2 text-ink/70">
            <li>
              <a
                href={`mailto:${siteConfig.supportEmail}`}
                className="hover:text-teal transition-colors"
              >
                {siteConfig.supportEmail}
              </a>
            </li>
            {activeSocials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  className="hover:text-teal transition-colors"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-ink/10 py-5 px-5 text-center text-xs text-ink/50 space-y-1">
        {hasTraderDetails() && (
          <p>
            {siteConfig.business.legalName},{" "}
            {siteConfig.business.addressLines.join(", ")}
            {siteConfig.business.companyNumber &&
              ` · Company no. ${siteConfig.business.companyNumber}`}
          </p>
        )}
        <p>
          © {new Date().getFullYear()} {siteConfig.brandName}. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
