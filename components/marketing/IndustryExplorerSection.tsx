type IndustryItem = { name: string; description: string };

type IndustryExplorerSectionProps = {
  title: string;
  industries: IndustryItem[];
};

export default function IndustryExplorerSection({ title, industries }: IndustryExplorerSectionProps) {
  return (
    <section aria-labelledby="industry-explorer-title" className="border-y border-aipify-border bg-aipify-surface-muted/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 id="industry-explorer-title" className="text-center text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <li key={industry.name} className="rounded-2xl border border-aipify-border bg-aipify-surface p-5 shadow-sm">
              <h3 className="text-base font-semibold text-aipify-companion">{industry.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{industry.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
