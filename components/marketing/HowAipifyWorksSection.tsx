import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";

type WorkStep = { title: string; description: string };

type HowAipifyWorksSectionProps = {
  title: string;
  subtitle: string;
  steps: WorkStep[];
};

export default function HowAipifyWorksSection({
  title,
  subtitle,
  steps,
}: HowAipifyWorksSectionProps) {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-y border-aipify-border bg-aipify-surface-muted/60" aria-labelledby="how-it-works-title">
      <div className={`${PublicMarketingClasses.container} ${PublicMarketingClasses.section}`}>
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="how-it-works-title" className={PublicMarketingClasses.sectionTitle}>
            {title}
          </h2>
          <p className={PublicMarketingClasses.sectionSubtitle}>{subtitle}</p>
        </div>

        <ol className="relative mt-14 space-y-6 lg:space-y-8">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className={`relative flex flex-col gap-4 lg:flex-row lg:items-center ${
                i % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className="lg:w-1/2 lg:px-8">
                <div className={`${PublicMarketingClasses.card} ${i % 2 === 0 ? "lg:text-right" : ""}`}>
                  <span className="text-sm font-semibold text-aipify-companion">Step {i + 1}</span>
                  <h3 className="mt-2 text-xl font-semibold text-aipify-text">{step.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-aipify-text-secondary">{step.description}</p>
                </div>
              </div>
              <div className="hidden lg:block lg:w-1/2" aria-hidden="true" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
