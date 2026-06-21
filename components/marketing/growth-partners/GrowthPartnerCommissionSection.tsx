import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import type { GrowthPartnersPageRedesignLabels } from "./types";

type Props = {
  commission: GrowthPartnersPageRedesignLabels["commission"];
};

export default function GrowthPartnerCommissionSection({ commission }: Props) {
  return (
    <section aria-labelledby="gp-commission-title" className={PublicMarketingClasses.section}>
      <div className={PublicMarketingClasses.containerWide}>
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="gp-commission-title" className={PublicMarketingClasses.sectionHeading}>{commission.title}</h2>
          <p className="mt-4 text-lg leading-relaxed text-aipify-text-secondary">{commission.intro}</p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <h3 className="text-lg font-semibold text-aipify-text">{commission.lifecycleTitle}</h3>
            <ol className="mt-6 space-y-3">
              {commission.lifecycleStages.map((stage, index) => (
                <li key={stage} className="flex items-center gap-3 rounded-xl border border-aipify-border bg-aipify-surface p-4 shadow-sm">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-aipify-accent-soft text-xs font-bold text-aipify-companion">
                    {index + 1}
                  </span>
                  <span className="text-sm text-aipify-text-secondary">{stage}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-aipify-border bg-aipify-surface p-6 shadow-md">
            <h3 className="text-lg font-semibold text-aipify-text">{commission.exampleTitle}</h3>
            <dl className="mt-6 divide-y divide-aipify-border">
              {commission.exampleRows.map((row) => (
                <div key={row.label} className="flex justify-between gap-4 py-3 text-sm">
                  <dt className="text-aipify-text-secondary">{row.label}</dt>
                  <dd className="font-medium text-aipify-text">{row.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-xs leading-relaxed text-aipify-text-muted">{commission.disclaimer}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
