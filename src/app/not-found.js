import Link from "next/link";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-5 py-28 text-center">
      <p className="text-teal text-sm font-semibold uppercase tracking-widest">404</p>
      <h1 className="text-3xl font-bold mt-3">We couldn&apos;t find that page</h1>
      <p className="text-ink/70 mt-4">
        The link may be old, or the page may have moved. The shop is still right
        where you left it.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/#shop"
          className="bg-ink text-cream rounded-full px-6 py-3 font-semibold transition-all duration-200 hover:opacity-85 active:scale-95"
        >
          See the beard oil
        </Link>
        <Link
          href="/"
          className="border border-ink/20 rounded-full px-6 py-3 font-semibold text-ink transition-colors hover:border-ink/40"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
