type SoftwareSprawlSectionProps = {
  title: string;
  tools: string[];
  coordinationLabel: string;
  closing: string;
};

export default function SoftwareSprawlSection({ title, tools, coordinationLabel, closing }: SoftwareSprawlSectionProps) {
  return (
    <section aria-labelledby="software-sprawl-title" className="border-y border-aipify-border bg-aipify-surface-muted/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 id="software-sprawl-title" className="text-center text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>
        <ul className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => (
            <li
              key={tool}
              className="rounded-xl border border-aipify-border bg-aipify-surface px-4 py-3 text-center text-sm font-medium text-aipify-text-secondary"
            >
              {tool}
            </li>
          ))}
        </ul>
        <div className="mx-auto mt-10 max-w-2xl">
          <div className="flex justify-center" aria-hidden="true">
            <span className="text-2xl text-aipify-companion">↓</span>
          </div>
          <div className="mt-4 rounded-2xl border border-aipify-accent-muted bg-aipify-accent-soft/50 px-6 py-5 text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-aipify-companion">{coordinationLabel}</p>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-base leading-relaxed text-aipify-text-secondary">
          {closing}
        </p>
      </div>
    </section>
  );
}
