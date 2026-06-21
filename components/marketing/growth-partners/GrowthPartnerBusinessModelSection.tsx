import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import type { GrowthPartnersPageRedesignLabels } from "./types";

type Props = {
  businessModel: GrowthPartnersPageRedesignLabels["businessModel"];
};

export default function GrowthPartnerBusinessModelSection({ businessModel }: Props) {
  return (
    <section aria-labelledby="gp-model-title" className={PublicMarketingClasses.section}>
      <div className={PublicMarketingClasses.containerWide}>
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="gp-model-title" className={PublicMarketingClasses.sectionHeading}>{businessModel.title}</h2>
          <p className="mt-4 text-lg leading-relaxed text-aipify-text-secondary">{businessModel.intro}</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {businessModel.columns.map((column) => (
            <div key={column.title} className="rounded-2xl border border-aipify-border bg-aipify-surface p-6 shadow-sm">
              <h3 className="text-base font-semibold text-aipify-text">{column.title}</h3>
              <ul className="mt-4 space-y-2">
                {column.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-aipify-text-secondary">
                    <span className="text-aipify-companion" aria-hidden="true">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
