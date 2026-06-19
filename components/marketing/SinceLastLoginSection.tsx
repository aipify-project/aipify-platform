type SinceLastLoginSectionProps = {
  title: string;
  panelLabel: string;
  items: string[];
  compact?: boolean;
};

export default function SinceLastLoginSection({
  title,
  panelLabel,
  items,
  compact = false,
}: SinceLastLoginSectionProps) {
  return (
    <section aria-labelledby="since-last-login-title" className="bg-aipify-surface">
      <div className={`mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 ${compact ? "py-12 lg:py-14" : "py-16 lg:py-20"}`}>
        <h2 id="since-last-login-title" className="text-center text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>
        <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-aipify-border bg-gradient-to-br from-aipify-accent-soft/80 to-violet-50/80 p-6 shadow-sm">
          <p className="text-sm font-semibold text-aipify-companion">{panelLabel}</p>
          <ul className="mt-4 space-y-2">
            {items.map((item) => (
              <li key={item} className="flex gap-3 rounded-lg border border-aipify-border/80 bg-aipify-surface/90 px-4 py-2.5 text-sm text-aipify-text-secondary">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aipify-companion" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
