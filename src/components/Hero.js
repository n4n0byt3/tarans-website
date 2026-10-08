import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";

// The brand's hero artwork: the bottle on wet stone in copper-lit smoke. The
// photo is the artwork with its baked-in text removed — the words are real
// text on top, so they stay sharp, can be translated and are read by search
// engines. Two extra smoke layers drift slowly over it (still for anyone who
// has reduced motion turned on).
export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#0d0a08] min-h-[640px] sm:min-h-0 sm:aspect-[1967/799] flex items-end sm:items-center">
      {/* On a phone the bottle sits above the text (top of the section);
          on a big screen it fills the whole section, beside the text. */}
      <picture className="absolute inset-x-0 top-0 h-[62%] sm:h-full sm:inset-0 -z-20">
        <source media="(max-width: 639px)" srcSet="/hero-bg-mobile.webp" />
        <Image
          src="/hero-bg.webp"
          alt={`${siteConfig.brandName} beard oil bottle on dark stone, surrounded by smoke`}
          fill
          priority
          sizes="100vw"
          className="object-cover object-top sm:object-center"
        />
      </picture>

      <div aria-hidden="true" className="hero-smoke hero-smoke-a -z-10" />
      <div aria-hidden="true" className="hero-smoke hero-smoke-b -z-10" />

      {/* Keeps the text readable over the photo: dark at the bottom on a
          phone, dark on the left on a big screen. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0d0a08] from-40% via-[#0d0a08]/60 via-55% to-transparent to-65% sm:from-0% sm:via-50% sm:to-100% sm:bg-gradient-to-r sm:from-[#0d0a08]/90 sm:via-[#0d0a08]/40 sm:to-transparent"
      />

      <div className="w-full px-5 sm:pl-[12.2%] sm:pr-0 pb-12 pt-[min(115vw,520px)] sm:pt-0 sm:pb-[3%] animate-fade-in-up">
        <div className="sm:whitespace-nowrap">
          <p className="text-teal text-[11px] sm:text-[clamp(11px,0.95vw,18px)] font-medium uppercase tracking-[0.2em]">
            Pre-orders open · The first drop
          </p>
          {/* Sized to the width of the hero on a big screen, so it breaks
              after "shouldn't" as in the artwork at any desktop width. */}
          <h1 className="mt-4 sm:mt-[0.9vw] font-display text-[2.75rem] leading-[1.05] sm:text-[4.3vw] sm:leading-[1.08] text-[#ece3d9]">
            Grooming shouldn&rsquo;t <br className="hidden sm:block" />
            feel like another job.
          </h1>
          <p className="mt-4 sm:mt-[0.6vw] text-ink/85 text-base sm:text-[clamp(1rem,1.1vw,1.4rem)]">{siteConfig.description}</p>
          <Link
            href="/beard-oil"
            className="group mt-8 sm:mt-[2vw] inline-flex items-center gap-3 rounded-full border border-teal/80 px-8 py-4 sm:px-[2.2vw] sm:py-[1.1vw] text-teal text-xs sm:text-[clamp(12px,0.9vw,17px)] font-semibold uppercase tracking-[0.2em] transition-colors duration-200 hover:bg-teal hover:text-[#0d0a08] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal"
          >
            Pre-order now
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
