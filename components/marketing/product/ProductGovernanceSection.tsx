import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import type { ProductPageContent } from "@/lib/marketing/parse-product-page";

type ProductGovernanceSectionProps = ProductPageContent["governance"];

export default function ProductGovernanceSection({
  title,
  subtitle,
  levels,
  workflowTitle,
  workflowSteps,
}: ProductGovernanceSectionProps) {
  return (
    <section id="governance" className="scroll-mt-20" aria-labelledby="product-governance-title">
      <div className={`${PublicMarketingClasses.container} py-14 sm:py-16`}>
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="product-governance-title" className={PublicMarketingClasses.sectionHeading}>
            {title}
          </h2>
          {subtitle ? <p className={PublicMarketingClasses.sectionSubtitle}>{subtitle}</p> : null}
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {levels.map((level) => (
            <li key={level.level} className={PublicMarketingClasses.card}>
              <span className="inline-flex rounded-full bg-aipify-accent-soft px-2.5 py-1 text-xs font-semibold text-aipify-companion">
                Level {level.level}
              </span>
              <h3 className={`${PublicMarketingClasses.cardTitle} mt-3`}>{level.title}</h3>
              <p className={PublicMarketingClasses.cardBody}>{level.body}</p>
              <dl className="mt-4 space-y-2 border-t border-aipify-border pt-4 text-xs">
                <div>
                  <dt className="font-semibold text-aipify-text-muted">Example</dt>
                  <dd className="mt-0.5 text-aipify-text-secondary">{level.example}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-aipify-text-muted">Human control</dt>
                  <dd className="mt-0.5 text-aipify-text-secondary">{level.humanControl}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-aipify-text-muted">Audit</dt>
                  <dd className="mt-0.5 text-aipify-text-secondary">{level.audit}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-aipify-text-muted">Reversible</dt>
                  <dd className="mt-0.5 text-aipify-text-secondary">{level.reversible}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>

        {workflowTitle && workflowSteps.length > 0 ? (
          <div className="mt-12 rounded-2xl border border-aipify-companion/20 bg-aipify-accent-soft/30 p-6 sm:p-8">
            <h3 className={PublicMarketingClasses.cardTitle}>{workflowTitle}</h3>
            <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {workflowSteps.map((step, i) => (
                <li key={step} className="flex gap-3 rounded-xl border border-aipify-border bg-aipify-surface px-4 py-3 text-sm text-aipify-text">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-aipify-companion text-xs font-semibold text-white">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </div>
    </section>
  );
}
