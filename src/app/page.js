import Image from "next/image";
import Hero from "@/components/Hero";
import TrustBadges from "@/components/TrustBadges";
import ProductCard from "@/components/ProductCard";
import FAQAccordion from "@/components/FAQAccordion";
import { products } from "@/lib/products";
import { siteConfig, shipStatus } from "@/lib/site-config";
import { jsonLd, organizationSchema, websiteSchema } from "@/lib/seo";

export const metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      {/* Ties the brand to its social profiles and names the site in results. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(organizationSchema())} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(websiteSchema())} />
      <Hero />

      <section id="story" className="bg-navy py-16 border-y border-ink/5">
        <div className="mx-auto max-w-4xl px-5 grid sm:grid-cols-[auto_1fr] gap-10 items-start">
          <Image
            src="/about/founder.png"
            alt={`${siteConfig.brandName} founder holding a bottle of the beard oil`}
            width={256}
            height={256}
            className="w-56 h-56 sm:w-64 sm:h-64 rounded-2xl object-cover mx-auto border-2 border-teal/40"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold mb-4">Our story</h2>
            <p className="text-lg font-semibold text-ink mb-4">
              We believe looking good shouldn&apos;t have to be complicated.
            </p>
            <div className="space-y-4 text-ink/70">
              <p>
                Men want to look sharp. They want a beard that feels good, skin
                that looks healthy, and to feel confident when they leave the
                house.
              </p>
              <p>But most grooming routines feel like another chore.</p>
              <p>AZAD BLACK was created to change that.</p>
              <p>
                We started with one simple idea: make taking care of yourself
                effortless.
              </p>
              <p>
                Our beard oil is more than something you put in your beard.
                It&apos;s a small daily ritual, a few seconds to look after
                yourself, feel fresh, and put a little more effort into the
                way you present yourself.
              </p>
              <p>No complicated routines. No unnecessary steps.</p>
            </div>
            <p className="text-teal font-semibold mt-5">
              Take care of yourself. Look good. Feel good.
            </p>
          </div>
        </div>
      </section>

      <TrustBadges />

      <section id="shop" className="py-16">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-center uppercase tracking-widest text-xs font-semibold text-teal">
            Pre-orders open
          </p>
          <h2 className="text-2xl font-bold text-center mt-3">
            Pre-order the first drop
          </h2>
          <p className="text-center text-ink/60 text-sm mt-3 mb-10 max-w-xl mx-auto">
            {shipStatus()} Cancel any time before it ships for a full refund.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      <FAQAccordion />
    </>
  );
}
