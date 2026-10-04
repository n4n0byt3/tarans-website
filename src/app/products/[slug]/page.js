import { notFound } from "next/navigation";
import Image from "next/image";
import { Fragment } from "react";
import { getProduct, products, ingredientsInci, productDetails, BOTTLE_SIZE } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { siteConfig } from "@/lib/site-config";
import { breadcrumbSchema, jsonLd, productDescription, productPath, productSchema } from "@/lib/seo";
import AddToCartForm from "@/components/AddToCartForm";
import PurchaseReassurance from "@/components/PurchaseReassurance";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  // Keyword first, price in the title: "1 Bottle — 30ml beard oil" said
  // nothing about what the shop sells to someone scanning search results.
  const title = `${siteConfig.brandName} Beard Oil ${BOTTLE_SIZE} — ${product.name}, pre-order ${formatPrice(product.priceCents)}`;
  const description = productDescription(product);
  const url = `${siteConfig.url}${productPath(product)}`;
  const imageAlt = `${siteConfig.brandName} beard oil, ${product.scent}`;

  return {
    // absolute: the layout's "| AZAD BLACK" suffix would repeat the brand.
    title: { absolute: title },
    description,
    alternates: { canonical: productPath(product) },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      images: [{ url: product.image, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 grid sm:grid-cols-2 gap-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(productSchema(product))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbSchema(product))} />
      <div className="flex justify-center items-center bg-peach-light rounded-2xl py-16 min-h-[22rem]">
        <Image
          src={product.image}
          alt={`${siteConfig.brandName} beard oil, ${product.scent}`}
          width={280}
          height={280}
          priority
          className="w-full max-w-[280px] h-auto object-contain rounded-lg"
        />
      </div>
      <div>
        <p className="uppercase tracking-widest text-xs font-semibold text-teal mb-2">
          Pre-order · The first drop
        </p>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-ink/60 mt-1">{product.scent}</p>
        <div className="flex items-center gap-3 mt-4">
          <p className="text-2xl font-bold">{formatPrice(product.priceCents)}</p>
          {product.compareAtCents && (
            <p className="text-ink/40 line-through" title="Price if bought as single bottles">
              <span className="sr-only">Price as single bottles: </span>
              {formatPrice(product.compareAtCents)}
            </p>
          )}
          {product.discountPercent > 0 && (
            <span className="bg-teal/15 text-teal text-xs font-bold px-2.5 py-1 rounded-full">
              Save {product.discountPercent}%
            </span>
          )}
        </div>
        {product.bottles > 0 && (
          <p className="text-ink/50 text-sm mt-1">
            {formatPrice(Math.round(product.priceCents / product.bottles))} per bottle
            {product.savingCents > 0 &&
              ` · ${formatPrice(product.savingCents)} less than ${product.bottles} single bottles`}
          </p>
        )}
        <p className="text-ink/70 mt-5">{product.description}</p>
        <ul className="mt-5 space-y-2 text-sm text-ink/70">
          {product.bullets.map((b) => (
            <li key={b} className="flex items-center gap-2">
              <span className="text-teal">✓</span> {b}
            </li>
          ))}
        </ul>
        <AddToCartForm product={product} />
        <PurchaseReassurance className="mt-5" />

        <div className="mt-8 pt-6 border-t border-ink/10">
          <h2 className="text-sm font-semibold text-ink">Details</h2>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm">
            <dt className="text-ink/50">Size</dt>
            <dd className="text-ink/70">{BOTTLE_SIZE} dropper bottle</dd>
            {productDetails.map((d) => (
              <Fragment key={d.label}>
                <dt className="text-ink/50">{d.label}</dt>
                <dd className="text-ink/70">{d.value}</dd>
              </Fragment>
            ))}
          </dl>
        </div>

        <div className="mt-6 pt-6 border-t border-ink/10">
          <h2 className="text-sm font-semibold text-ink">Ingredients</h2>
          {ingredientsInci ? (
            <p className="text-ink/60 text-sm mt-2 leading-relaxed">
              {ingredientsInci}
            </p>
          ) : (
            <p className="text-ink/60 text-sm mt-2">
              The full ingredient list will be printed on the bottle. If you have allergies
              and want the list before ordering, email{" "}
              <a
                href={`mailto:${siteConfig.supportEmail}`}
                className="text-teal hover:underline"
              >
                {siteConfig.supportEmail}
              </a>
              .
            </p>
          )}
          <p className="text-ink/40 text-xs mt-3">
            For external use only. Patch test first if you have sensitive skin.
          </p>
        </div>
      </div>
    </div>
  );
}
