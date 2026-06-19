type EnterpriseReadinessSectionProps = {
  title: string;
  subtitle?: string;
  items: string[];
};

export default function EnterpriseReadinessSection({ title, subtitle, items }: EnterpriseReadinessSectionProps) {
  return (
    <section id="enterprise-ready" aria-labelledby="enterprise-ready-title" className="border-y border-aipify-border bg-aipify-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="enterprise-ready-title" className="text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
            {title}
          </h2>
          {subtitle ? <p className="mt-4 text-aipify-text-secondary">{subtitle}</p> : null}
        </div>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {items.map((item) => (
            <li
              key={item}
              className="rounded-xl border border-aipify-border bg-aipify-surface-muted/50 px-4 py-3 text-center text-sm font-medium text-aipify-text"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
