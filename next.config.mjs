/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // The three pack pages (/products/one-bottle etc.) became options on one
  // product page. Old links go there. Limited to the old slugs on purpose:
  // redirects run before /public is served, and the product photos live
  // under /products/ too.
  redirects() {
    return [
      {
        source: "/products/:slug(one-bottle|two-bottles|three-bottles)",
        destination: "/beard-oil",
        permanent: true,
      },
    ];
  },
  headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Force HTTPS for two years, including subdomains.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Stop browsers guessing content types (MIME sniffing attacks).
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Block the site being framed elsewhere (clickjacking).
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          // Don't leak full URLs to third parties.
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // No page here needs these device APIs.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
