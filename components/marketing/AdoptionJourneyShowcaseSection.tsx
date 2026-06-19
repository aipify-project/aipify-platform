type AdoptionStep = { title: string; description: string };

type AdoptionJourneyShowcaseSectionProps = {
  title: string;
  steps: AdoptionStep[];
};

export default function AdoptionJourneyShowcaseSection({ title, steps }: AdoptionJourneyShowcaseSectionProps) {
  return (
    <section id="adoption-journey" aria-labelledby="adoption-journey-title" className="bg-aipify-surface">
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 id="adoption-journey-title" className="text-center text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>
        <ol className="mt-12 space-y-0">
          {steps.map((step, index) => (
            <li key={step.title} className="flex flex-col items-center">
              <div className="w-full rounded-xl border border-aipify-border bg-aipify-surface-muted/60 px-5 py-4 text-center">
                <p className="text-sm font-semibold text-aipify-companion">{step.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{step.description}</p>
              </div>
              {index < steps.length - 1 ? (
                <span className="my-2 text-lg text-aipify-companion" aria-hidden="true">
                  ↓
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
