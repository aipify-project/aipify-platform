type OperationalIntelligenceLifecycleSectionProps = {
  title: string;
  steps: string[];
};

export default function OperationalIntelligenceLifecycleSection({
  title,
  steps,
}: OperationalIntelligenceLifecycleSectionProps) {
  return (
    <section aria-labelledby="operational-intelligence-title" className="border-y border-aipify-border bg-aipify-surface-muted/60">
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2
          id="operational-intelligence-title"
          className="text-center text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl"
        >
          {title}
        </h2>
        <ol className="mt-12 space-y-0">
          {steps.map((step, index) => (
            <li key={step} className="flex flex-col items-center">
              <div className="w-full rounded-xl border border-aipify-border bg-aipify-surface px-5 py-4 text-center text-sm font-semibold text-aipify-text">
                {step}
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
