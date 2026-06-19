type ModernSoftwareProblemSectionProps = {
  title: string;
  systems: string[];
  closing: string[];
};

export default function ModernSoftwareProblemSection({
  title,
  systems,
  closing,
}: ModernSoftwareProblemSectionProps) {
  return (
    <section aria-labelledby="modern-software-problem-title" className="border-y border-aipify-border bg-aipify-surface-muted/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 id="modern-software-problem-title" className="text-center text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>
        <ul className="mx-auto mt-10 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {systems.map((system) => (
            <li
              key={system}
              className="rounded-xl border border-aipify-border bg-aipify-surface px-4 py-3 text-center text-sm font-medium text-aipify-text-secondary"
            >
              {system}
            </li>
          ))}
        </ul>
        <div className="mx-auto mt-10 max-w-3xl space-y-3 text-center text-base leading-relaxed text-aipify-text-secondary">
          {closing.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
