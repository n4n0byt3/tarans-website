"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { siteConfig } from "@/lib/site-config";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const perBottleCents = product.bottles
    ? Math.round(product.priceCents / product.bottles)
    : null;

  return (
    <div
      className={`group relative bg-navy rounded-2xl border flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        product.isBestValue
          ? "border-teal/50 hover:border-teal"
          : "border-ink/10 hover:border-ink/25"
      }`}
    >
      {product.isBestValue && (
        <span className="absolute top-3 right-3 z-10 bg-teal text-cream text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
          Best value
        </span>
      )}

      <Link
        href={`/products/${product.slug}`}
        className="block relative aspect-square overflow-hidden bg-peach-light"
      >
        <Image
          src={product.image}
          alt={`${siteConfig.brandName} beard oil, ${product.scent}`}
          fill
          sizes="(max-width: 640px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-col flex-1 p-5 text-center">
        <Link
          href={`/products/${product.slug}`}
          className="font-semibold hover:underline"
        >
          {product.name}
        </Link>
        <p className="text-ink/60 text-sm mt-1">{product.scent}</p>

        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="font-bold text-lg">{formatPrice(product.priceCents)}</span>
          {product.compareAtCents && (
            <span
              className="text-ink/40 line-through text-sm"
              title="Price if bought as single bottles"
            >
              <span className="sr-only">Price as single bottles: </span>
              {formatPrice(product.compareAtCents)}
            </span>
          )}
        </div>

        {/* The whole point of quantity tiers — without this the saving is invisible. */}
        {perBottleCents && (
          <p className="text-ink/50 text-xs mt-1">
            {formatPrice(perBottleCents)} per bottle
          </p>
        )}

        {product.savingCents > 0 && (
          <p className="text-teal text-xs font-semibold mt-2">
            Save {formatPrice(product.savingCents)} vs single bottles
          </p>
        )}

        {/* mt-auto keeps the buttons on one line across cards of unequal height */}
        <div className="mt-auto pt-4">
          <button
            onClick={() => addItem(product)}
            className="w-full bg-ink text-cream rounded-full py-2.5 text-sm font-semibold transition-all duration-200 hover:opacity-85 active:scale-95"
          >
            Pre-order
          </button>
        </div>
      </div>
    </div>
  );
}
