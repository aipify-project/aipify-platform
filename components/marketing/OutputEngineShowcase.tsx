type OutputEngineShowcaseProps = {
  title: string;
  subtitle: string;
  items: string[];
};

export default function OutputEngineShowcase({
  title,
  subtitle,
  items,
}: OutputEngineShowcaseProps) {
  return (
    <section className="border-y border-aipify-border bg-aipify-surface-muted/60" aria-labelledby="outputs-title">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="outputs-title" className="text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-aipify-text-secondary">{subtitle}</p>
        </div>

        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-xl border border-aipify-border bg-aipify-surface p-4 shadow-sm"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-aipify-accent-soft text-xs font-bold text-aipify-companion">
                {i + 1}
              </span>
              <span className="text-sm text-aipify-text-secondary">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
