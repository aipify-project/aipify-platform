type JourneyStep = { title: string; description: string };

type CustomerJourneySectionProps = {
  title: string;
  subtitle: string;
  steps: JourneyStep[];
};

export default function CustomerJourneySection({ title, subtitle, steps }: CustomerJourneySectionProps) {
  return (
    <section id="customer-journey" aria-labelledby="customer-journey-title" className="bg-aipify-surface-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="customer-journey-title" className="text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-aipify-text-secondary">{subtitle}</p>
        </div>

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {steps.map((step, i) => (
            <li key={step.title} className="relative rounded-2xl border border-aipify-border bg-aipify-surface p-5 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wide text-aipify-companion">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-base font-semibold text-aipify-text">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
