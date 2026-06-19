type OperationalFrictionSectionProps = {
  title: string;
  problems: string[];
  closing: string;
};

export default function OperationalFrictionSection({ title, problems, closing }: OperationalFrictionSectionProps) {
  return (
    <section aria-labelledby="operational-friction-title" className="border-y border-aipify-border bg-aipify-surface-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 id="operational-friction-title" className="text-center text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>
        <ul className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((problem) => (
            <li
              key={problem}
              className="rounded-xl border border-aipify-border bg-aipify-surface px-4 py-3 text-sm text-aipify-text-secondary"
            >
              {problem}
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-10 max-w-3xl text-center text-base leading-relaxed text-aipify-text-secondary">
          {closing}
        </p>
      </div>
    </section>
  );
}
