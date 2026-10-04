const badges = [
  { title: "30-Day Guarantee", desc: "Try Azad Black without the risk. If it's not for you, we'll make it right." },
  { title: "EASY TO USE", desc: "A few drops. A better-feeling beard" },
  { title: "PRE-ORDER", desc: "Cancel any time before it ships for a full refund." },
  { title: "FEEL GOOD", desc: "Lightweight, smooth and made for everyday beard care." },
];

export default function TrustBadges() {
  return (
    <section className="bg-navy text-ink py-10">
      <div className="mx-auto max-w-6xl px-5 grid grid-cols-2 sm:grid-cols-4 gap-8">
        {badges.map((b) => (
          <div key={b.title} className="text-center sm:text-left">
            <p className="font-semibold">{b.title}</p>
            <p className="text-ink/60 text-sm mt-1">{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
