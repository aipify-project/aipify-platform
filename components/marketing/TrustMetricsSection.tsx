type TrustMetricCard = { label: string; value: string };

type TrustMetricsSectionProps = {
  title?: string;
  cards: TrustMetricCard[];
};

export default function TrustMetricsSection({ title, cards }: TrustMetricsSectionProps) {
  return (
    <section aria-labelledby={title ? "trust-metrics-title" : undefined} className="border-y border-aipify-border bg-aipify-surface-muted/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        {title ? (
          <h2 id="trust-metrics-title" className="text-center text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
            {title}
          </h2>
        ) : null}
        <ul className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${title ? "mt-12" : ""}`}>
          {cards.map((card) => (
            <li key={card.label} className="rounded-2xl border border-aipify-border bg-aipify-surface p-6 text-center shadow-sm">
              <p className="text-3xl font-bold tracking-tight text-aipify-companion">{card.value}</p>
              <p className="mt-2 text-sm font-medium text-aipify-text-secondary">{card.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
