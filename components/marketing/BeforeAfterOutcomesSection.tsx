type BeforeAfterOutcomesSectionProps = {
  title: string;
  beforeTitle: string;
  afterTitle: string;
  before: string[];
  after: string[];
};

export default function BeforeAfterOutcomesSection({
  title,
  beforeTitle,
  afterTitle,
  before,
  after,
}: BeforeAfterOutcomesSectionProps) {
  return (
    <section aria-labelledby="business-outcomes-title" className="border-y border-aipify-border bg-aipify-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 id="business-outcomes-title" className="text-center text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-aipify-border bg-aipify-surface-muted/60 p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-aipify-text-muted">{beforeTitle}</p>
            <ul className="mt-5 space-y-3">
              {before.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-aipify-text-secondary">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aipify-text-muted" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-aipify-accent-muted bg-aipify-accent-soft/40 p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-aipify-companion">{afterTitle}</p>
            <ul className="mt-5 space-y-3">
              {after.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-aipify-text">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aipify-companion" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
