type ImplementationStep = { title: string; description: string };

type ImplementationJourneySectionProps = {
  title: string;
  steps: ImplementationStep[];
};

export default function ImplementationJourneySection({ title, steps }: ImplementationJourneySectionProps) {
  return (
    <section id="implementation-journey" aria-labelledby="implementation-journey-title" className="border-y border-aipify-border bg-aipify-surface-muted/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 id="implementation-journey-title" className="text-center text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, index) => (
            <li key={step.title} className="rounded-2xl border border-aipify-border bg-aipify-surface p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-aipify-companion">Step {index + 1}</p>
              <h3 className="mt-2 text-base font-semibold text-aipify-text">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
