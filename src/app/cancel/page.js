import Link from "next/link";

export const metadata = {
  title: "Checkout cancelled",
  robots: { index: false, follow: true },
};

export default function CancelPage() {
  return (
    <div className="mx-auto max-w-lg px-5 py-24 text-center">
      <h1 className="text-3xl font-bold">Checkout cancelled</h1>
      <p className="text-ink/70 mt-4">
        No charge was made. Your cart is still saved if you&apos;d like to try again.
      </p>
      <Link
        href="/"
        className="inline-block mt-8 bg-ink text-cream rounded-full px-6 py-3 font-semibold"
      >
        Back to shop
      </Link>
    </div>
  );
}
