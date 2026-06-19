type SecurityReassuranceSectionProps = {
  title: string;
  items: string[];
};

export default function SecurityReassuranceSection({ title, items }: SecurityReassuranceSectionProps) {
  return (
    <section aria-labelledby="security-reassurance-title" className="border-y border-aipify-border bg-aipify-surface-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 id="security-reassurance-title" className="text-center text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>
        <ul className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-xl border border-aipify-border bg-aipify-surface px-4 py-3 text-sm text-aipify-text-secondary"
            >
              <span className="mt-0.5 text-aipify-companion" aria-hidden="true">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
