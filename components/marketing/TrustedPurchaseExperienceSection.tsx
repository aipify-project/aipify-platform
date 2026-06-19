type TrustedPurchaseExperienceSectionProps = {
  title: string;
  intro: string;
  steps: string[];
};

export default function TrustedPurchaseExperienceSection({
  title,
  intro,
  steps,
}: TrustedPurchaseExperienceSectionProps) {
  return (
    <section aria-labelledby="trusted-purchase-title" className="bg-aipify-surface">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
        <h2 id="trusted-purchase-title" className="text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-aipify-text-secondary">{intro}</p>
        <ol className="mx-auto mt-10 grid max-w-md gap-3 text-left">
          {steps.map((step, index) => (
            <li
              key={step}
              className="flex gap-3 rounded-xl border border-aipify-border bg-aipify-surface-muted/60 px-4 py-3 text-sm text-aipify-text-secondary"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-aipify-companion text-xs font-semibold text-white">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
