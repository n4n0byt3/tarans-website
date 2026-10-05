import Link from "next/link";
import Image from "next/image";
import { PRODUCT, products, BOTTLE_SIZE } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { siteConfig } from "@/lib/site-config";
import { lowestPriceCents } from "@/lib/seo";

// The one product on the homepage. The whole card opens the product page,
// where the pack sizes are chosen.
export default function ProductCard() {
  const maxSavingCents = Math.max(...products.map((p) => p.savingCents || 0));

  return (
    <Link
      href={PRODUCT.path}
      className="group mx-auto max-w-3xl grid sm:grid-cols-2 bg-navy rounded-2xl border border-ink/10 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-ink/25"
    >
      <div className="relative aspect-square overflow-hidden bg-peach-light">
        <Image
          src={PRODUCT.image.src}
          alt={`${siteConfig.brandName} beard oil, ${BOTTLE_SIZE} dropper bottle`}
          fill
          sizes="(max-width: 640px) 100vw, 384px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col justify-center p-6 sm:p-8 text-center sm:text-left">
        <p className="text-teal text-xs font-semibold uppercase tracking-widest">Beard care</p>
        <h3 className="text-2xl font-bold mt-2">
          {siteConfig.brandName} {PRODUCT.name}
        </h3>
        <p className="mt-2 text-xs uppercase tracking-[0.3em] text-ink/55">
          {PRODUCT.keywords.join(" / ")}
        </p>
        <p className="mt-4 text-lg">
          <span className="text-ink/60 text-sm">From </span>
          <span className="font-bold">{formatPrice(lowestPriceCents())}</span>
        </p>
        <p className="text-ink/55 text-sm mt-1">
          {BOTTLE_SIZE} bottle · 1, 2 or 3 bottles
          {maxSavingCents > 0 && ` — save up to ${formatPrice(maxSavingCents)}`}
        </p>
        <span className="mt-6 inline-block bg-ink text-cream rounded-full px-7 py-3.5 font-semibold uppercase tracking-widest text-sm transition-opacity duration-200 group-hover:opacity-85">
          Pre-order
        </span>
      </div>
    </Link>
  );
}
