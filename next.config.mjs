/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // For a while the three pack pages were merged into a single /beard-oil
  // page, and old /products/... links were permanently redirected there.
  // Browsers cache permanent redirects, so /beard-oil has to keep working:
  // it now sends people to the packs on the homepage. Temporary, so it can
  // be reused later.
  redirects() {
    return [
      {
        source: "/beard-oil",
        destination: "/#shop",
        permanent: false,
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
