import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import type { ProductPageContent } from "@/lib/marketing/parse-product-page";

type ProductEnterpriseSectionProps = ProductPageContent["enterprise"];

const STATUS_STYLES: Record<ProductPageContent["enterprise"]["pillars"][number]["status"], string> = {
  available: "border-emerald-200 bg-emerald-50 text-emerald-800",
  custom: "border-violet-200 bg-violet-50 text-violet-800",
  planned: "border-amber-200 bg-amber-50 text-amber-800",
  enterprise_only: "border-indigo-200 bg-indigo-50 text-indigo-800",
};

export default function ProductEnterpriseSection({
  title,
  pillars,
  trust,
  statusLabels,
}: ProductEnterpriseSectionProps) {
  return (
    <section
      id="enterprise"
      className={`scroll-mt-20 ${AipifyMarketingClasses.sectionAlt}`}
      aria-labelledby="product-enterprise-title"
    >
      <div className={`${PublicMarketingClasses.container} py-14 sm:py-16`}>
        <div className="max-w-2xl">
          <h2 id="product-enterprise-title" className={PublicMarketingClasses.sectionHeading}>
            {title}
          </h2>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <ul className="grid gap-4 sm:grid-cols-2">
            {pillars.map((pillar) => (
              <li key={pillar.title} className={PublicMarketingClasses.card}>
                <div className="flex items-start justify-between gap-3">
                  <h3 className={PublicMarketingClasses.cardTitle}>{pillar.title}</h3>
                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[pillar.status]}`}
                  >
                    {statusLabels[pillar.status]}
                  </span>
                </div>
                <p className={PublicMarketingClasses.cardBody}>{pillar.benefit}</p>
                <p className="mt-2 text-xs text-aipify-text-muted">{pillar.example}</p>
              </li>
            ))}
          </ul>

          <div className="rounded-2xl border border-aipify-border bg-aipify-surface p-6 shadow-sm">
            <p className={PublicMarketingClasses.cardLabel}>Trust panel</p>
            <ul className="mt-4 space-y-4">
              {trust.map((item) => (
                <li key={item.title}>
                  <h3 className="text-sm font-semibold text-aipify-text">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-aipify-text-secondary">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
