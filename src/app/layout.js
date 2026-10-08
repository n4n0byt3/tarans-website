import { Geist, Geist_Mono, Gilda_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Nav from "@/components/Nav";
import CartDrawer from "@/components/CartDrawer";
import EmailOfferModal from "@/components/EmailOfferModal";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site-config";
import { siteDescription } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// The display serif for the homepage headline.
const gilda = Gilda_Display({
  variable: "--font-gilda",
  weight: "400",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.seoTitle,
    template: `%s | ${siteConfig.brandName}`,
  },
  description: siteDescription(),
  applicationName: siteConfig.brandName,
  // No canonical here: set on the root layout it's inherited by every page
  // that forgets its own, and each of those then claims to be the homepage.
  openGraph: {
    type: "website",
    siteName: siteConfig.brandName,
    title: siteConfig.seoTitle,
    description: siteDescription(),
    url: siteConfig.url,
    locale: "en_GB",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${siteConfig.brandName} beard oil` }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seoTitle,
    description: siteDescription(),
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en-GB"
      className={`${geistSans.variable} ${geistMono.variable} ${gilda.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <CartProvider>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <EmailOfferModal />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
