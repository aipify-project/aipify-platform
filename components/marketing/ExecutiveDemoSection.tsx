type ExecutiveDemoSectionProps = {
  title: string;
  mockupLabel: string;
  items: string[];
};

export default function ExecutiveDemoSection({ title, mockupLabel, items }: ExecutiveDemoSectionProps) {
  return (
    <section aria-labelledby="executive-demo-title" className="border-y border-aipify-border bg-aipify-surface-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 id="executive-demo-title" className="text-center text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>
        <div className="mx-auto mt-12 max-w-4xl rounded-3xl border border-aipify-border bg-gradient-to-br from-aipify-accent-soft/80 to-violet-50/80 p-6 shadow-sm sm:p-8">
          <p className="text-center text-xs font-semibold uppercase tracking-wide text-aipify-companion">{mockupLabel}</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-aipify-border/80 bg-aipify-surface/90 px-4 py-4 text-center text-sm font-medium text-aipify-text"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
