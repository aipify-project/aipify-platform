type AipifyDifferenceSectionProps = {
  title: string;
  traditionalTitle: string;
  aipifyTitle: string;
  traditional: string[];
  aipify: string[];
};

export default function AipifyDifferenceSection({
  title,
  traditionalTitle,
  aipifyTitle,
  traditional,
  aipify,
}: AipifyDifferenceSectionProps) {
  return (
    <section aria-labelledby="aipify-difference-title" className="bg-aipify-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 id="aipify-difference-title" className="text-center text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-aipify-border bg-aipify-surface-muted/60 p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-aipify-text-muted">{traditionalTitle}</h3>
            <ul className="mt-5 space-y-3">
              {traditional.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-aipify-text-secondary">
                  <span className="mt-1.5 text-aipify-text-muted" aria-hidden="true">
                    —
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-aipify-accent-muted bg-aipify-accent-soft/40 p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-aipify-companion">{aipifyTitle}</h3>
            <ul className="mt-5 space-y-3">
              {aipify.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-aipify-text">
                  <span className="mt-0.5 text-aipify-companion" aria-hidden="true">
                    ✓
                  </span>
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
