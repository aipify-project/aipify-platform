type ConfidenceItem = { title: string; description: string };

type EnterpriseConfidenceStripProps = {
  title: string;
  subtitle?: string;
  items: ConfidenceItem[];
};

export default function EnterpriseConfidenceStrip({ title, subtitle, items }: EnterpriseConfidenceStripProps) {
  return (
    <section className="border-y border-aipify-border bg-aipify-surface" aria-labelledby="enterprise-confidence-title">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="text-center">
          <h2 id="enterprise-confidence-title" className="text-xl font-bold tracking-tight text-aipify-text sm:text-2xl">
            {title}
          </h2>
          {subtitle ? <p className="mt-2 text-sm text-aipify-text-secondary">{subtitle}</p> : null}
        </div>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {items.map((item) => (
            <li key={item.title} className="rounded-lg border border-aipify-border bg-aipify-surface-muted/50 px-3 py-3">
              <p className="text-xs font-semibold text-aipify-companion">{item.title}</p>
              <p className="mt-1 text-xs leading-snug text-aipify-text-secondary">{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
