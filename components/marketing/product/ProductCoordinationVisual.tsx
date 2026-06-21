import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import type { ProductPageContent } from "@/lib/marketing/parse-product-page";

type ProductCoordinationVisualProps = ProductPageContent["coordination"];

export default function ProductCoordinationVisual({
  title,
  subtitle,
  peopleTitle,
  people,
  aipifyTitle,
  aipifyModules,
  systemsTitle,
  systems,
}: ProductCoordinationVisualProps) {
  return (
    <section aria-labelledby="product-coordination-title">
      <div className={`${PublicMarketingClasses.container} py-14 sm:py-16`}>
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="product-coordination-title" className={PublicMarketingClasses.sectionHeading}>
            {title}
          </h2>
          {subtitle ? <p className={PublicMarketingClasses.sectionSubtitle}>{subtitle}</p> : null}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_auto_1.2fr_auto_1fr] lg:items-stretch lg:gap-4">
          <div className={PublicMarketingClasses.card}>
            <p className={PublicMarketingClasses.cardLabel}>{peopleTitle}</p>
            <ul className="mt-4 space-y-2">
              {people.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-aipify-text">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-aipify-accent" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden items-center justify-center lg:flex" aria-hidden="true">
            <span className="text-2xl text-aipify-text-muted">→</span>
          </div>

          <div className="rounded-2xl border-2 border-aipify-companion/30 bg-aipify-accent-soft/50 p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-aipify-companion">{aipifyTitle}</p>
            <ul className="mt-4 space-y-2">
              {aipifyModules.map((item) => (
                <li key={item} className="flex gap-2 text-sm font-medium text-aipify-text">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-aipify-companion" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden items-center justify-center lg:flex" aria-hidden="true">
            <span className="text-2xl text-aipify-text-muted">→</span>
          </div>

          <div className={PublicMarketingClasses.card}>
            <p className={PublicMarketingClasses.cardLabel}>{systemsTitle}</p>
            <ul className="mt-4 space-y-2">
              {systems.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-aipify-text">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-aipify-text-muted" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
