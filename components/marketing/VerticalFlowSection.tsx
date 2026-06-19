type VerticalFlowSectionProps = {
  title?: string;
  steps: string[];
  muted?: boolean;
  sectionId?: string;
};

export default function VerticalFlowSection({
  title,
  steps,
  muted = false,
  sectionId,
}: VerticalFlowSectionProps) {
  const headingId = sectionId ?? (title ? `vertical-flow-${title.replace(/\s+/g, "-").toLowerCase()}` : undefined);

  return (
    <section aria-labelledby={headingId} className={muted ? "bg-aipify-surface-muted/60" : "bg-aipify-surface"}>
      <div className="mx-auto max-w-lg px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        {title ? (
          <h2 id={headingId} className="text-center text-2xl font-bold tracking-tight text-aipify-text sm:text-3xl">
            {title}
          </h2>
        ) : null}
        <ol className={`space-y-0 ${title ? "mt-10" : ""}`}>
          {steps.map((step, index) => (
            <li key={step} className="flex flex-col items-center">
              <div className="w-full rounded-xl border border-aipify-border bg-aipify-surface-muted/60 px-4 py-3 text-center text-sm font-medium text-aipify-text-secondary">
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
