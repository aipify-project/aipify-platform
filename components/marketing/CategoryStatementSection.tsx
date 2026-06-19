type CategoryStatementSectionProps = {
  title: string;
  negations: string[];
  affirmation: string;
  closing: string;
  compact?: boolean;
};

export default function CategoryStatementSection({
  title,
  negations,
  affirmation,
  closing,
  compact = false,
}: CategoryStatementSectionProps) {
  return (
    <section
      id="category-statement"
      aria-labelledby="category-statement-title"
      className="border-b border-aipify-border bg-aipify-accent-soft/30"
    >
      <div
        className={`mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8 ${compact ? "py-12 lg:py-14" : "py-16 lg:py-20"}`}
      >
        <h2 id="category-statement-title" className="text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>
        <ul className="mx-auto mt-8 max-w-xl space-y-2">
          {negations.map((line) => (
            <li key={line} className="text-base text-aipify-text-muted">
              {line}
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-8 max-w-2xl text-xl font-semibold text-aipify-companion sm:text-2xl">{affirmation}</p>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-aipify-text-secondary">{closing}</p>
      </div>
    </section>
  );
}
