"use client";

import { useState } from "react";
import Link from "next/link";
import { faqs } from "@/lib/faqs";
import { faqSchema, jsonLd } from "@/lib/seo";

const linkClass = "text-teal hover:underline";

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqSchema(faqs))} />
      <div className="mx-auto max-w-3xl px-5">
        <h2 className="text-2xl font-bold text-center mb-10">
          Frequently asked questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="border border-ink/15 rounded-xl overflow-hidden transition-colors hover:border-ink/30"
              >
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left font-medium"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  {faq.q}
                  <span
                    aria-hidden="true"
                    className={`text-teal text-xl leading-none transition-transform duration-300 ${
                      isOpen ? "rotate-45" : "rotate-0"
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  id={`faq-panel-${i}`}
                  // Collapsed answers are only visually hidden, so without
                  // inert their links would still be reachable by Tab.
                  inert={!isOpen}
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p
                      className={`px-5 pb-4 text-ink/70 text-sm transition-opacity duration-300 ${
                        isOpen ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {faq.text}
                      {faq.link && (
                        <>
                          {" "}
                          <Link href={faq.link.href} className={linkClass}>
                            {faq.link.label}
                          </Link>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
