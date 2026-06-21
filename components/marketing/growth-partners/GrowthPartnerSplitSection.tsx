import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import type { GrowthPartnersPageRedesignLabels } from "./types";

type Props = {
  split: GrowthPartnersPageRedesignLabels["split"];
};

export default function GrowthPartnerSplitSection({ split }: Props) {
  return (
    <section aria-labelledby="gp-split-title" className={PublicMarketingClasses.section}>
      <div className={PublicMarketingClasses.containerWide}>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 id="gp-split-title" className={PublicMarketingClasses.sectionHeading}>
              {split.youBuild.title}
            </h2>
            <ul className="mt-8 space-y-4">
              {split.youBuild.items.map((item) => (
                <li key={item} className="flex gap-3 rounded-2xl border border-aipify-border bg-aipify-surface p-4 shadow-sm">
                  <span className="text-aipify-companion" aria-hidden="true">→</span>
                  <span className="text-sm leading-relaxed text-aipify-text-secondary">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className={PublicMarketingClasses.sectionHeading}>{split.aipifyProvides.title}</h2>
            <ul className="mt-8 space-y-4">
              {split.aipifyProvides.items.map((item) => (
                <li key={item} className="flex gap-3 rounded-2xl border border-aipify-border bg-aipify-accent-soft/30 p-4">
                  <span className="text-aipify-companion" aria-hidden="true">✓</span>
                  <span className="text-sm leading-relaxed text-aipify-text-secondary">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
