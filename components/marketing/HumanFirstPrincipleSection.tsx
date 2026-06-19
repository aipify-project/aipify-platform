type HumanFirstPrincipleSectionProps = {
  title: string;
  principles: string[];
  closing: string;
};

export default function HumanFirstPrincipleSection({
  title,
  principles,
  closing,
}: HumanFirstPrincipleSectionProps) {
  return (
    <section aria-labelledby="human-first-title" className="bg-aipify-surface-muted/60">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 id="human-first-title" className="text-center text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>
        <ul className="mt-10 space-y-4">
          {principles.map((line) => (
            <li
              key={line}
              className="rounded-2xl border border-aipify-border bg-aipify-surface px-6 py-4 text-center text-base font-medium text-aipify-text"
            >
              {line}
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-base leading-relaxed text-aipify-text-secondary">{closing}</p>
      </div>
    </section>
  );
}
