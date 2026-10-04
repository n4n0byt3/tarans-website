import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";

export default function Hero() {
  return (
    <section className="bg-peach">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24 grid sm:grid-cols-2 gap-10 items-center">
        <div className="animate-fade-in-up">
          <p className="uppercase tracking-widest text-xs font-semibold text-teal mb-4">
            Pre-orders open · The first drop
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-ink leading-tight">
            {siteConfig.tagline}
          </h1>
          <p className="mt-5 text-ink/70 text-lg max-w-md">
            {siteConfig.description}
          </p>
          <Link
            href="#shop"
            className="inline-block mt-8 bg-ink text-cream rounded-full px-7 py-3.5 font-semibold transition-all duration-200 hover:opacity-85 active:scale-95"
          >
            Pre-order now
          </Link>
        </div>
        <div
          className="flex justify-center animate-fade-in-up"
          style={{ animationDelay: "0.15s" }}
        >
          <Image
            src="/hero.png"
            alt={`${siteConfig.brandName} founder holding a dropper bottle of beard oil`}
            width={620}
            height={633}
            priority
            className="w-full max-w-xl rounded-2xl object-cover border border-ink/10 transition-transform duration-500 hover:scale-[1.02]"
          />
        </div>
      </div>
    </section>
  );
}
