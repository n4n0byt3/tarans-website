import Link from "next/link";
import { PRODUCT, BOTTLE_SIZE } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { siteConfig } from "@/lib/site-config";
import {
  breadcrumbSchema,
  jsonLd,
  lowestPriceCents,
  productDescription,
  productSchema,
} from "@/lib/seo";
import ProductView from "@/components/ProductView";

const title = `${siteConfig.brandName} Beard Oil ${BOTTLE_SIZE} — Pre-order from ${formatPrice(lowestPriceCents())}`;

export const metadata = {
  // absolute: the layout's "| AZAD BLACK" suffix would repeat the brand.
  title: { absolute: title },
  description: productDescription(),
  alternates: { canonical: PRODUCT.path },
  openGraph: {
    type: "website",
    title,
    description: productDescription(),
    url: PRODUCT.path,
    images: [{ url: PRODUCT.image.src, alt: `${siteConfig.brandName} beard oil` }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: productDescription(),
    images: [PRODUCT.image.src],
  },
};

const crumbClass = "hover:text-ink transition-colors";

export default function BeardOilPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-6 pb-16 sm:pt-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(productSchema())} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbSchema())} />

      <nav aria-label="Breadcrumb" className="mb-6 text-[11px] uppercase tracking-widest text-ink/50">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/" className={crumbClass}>
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/#shop" className={crumbClass}>
              Beard care
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink/80">
            Beard oil
          </li>
        </ol>
      </nav>

      <ProductView />
    </div>
  );
}
