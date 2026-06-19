type TrustCard = { title: string; description: string };

type TrustCredibilityBarProps = {
  title: string;
  cards: TrustCard[];
};

export default function TrustCredibilityBar({ title, cards }: TrustCredibilityBarProps) {
  return (
    <section aria-labelledby="trust-bar-title" className="border-b border-aipify-border bg-aipify-surface-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <h2 id="trust-bar-title" className="text-center text-2xl font-bold tracking-tight text-aipify-text sm:text-3xl">
          {title}
        </h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <li
              key={card.title}
              className="rounded-2xl border border-aipify-border bg-aipify-surface p-6 shadow-sm"
            >
              <h3 className="text-base font-semibold text-aipify-companion">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{card.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
