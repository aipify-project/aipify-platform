import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import type { GrowthPartnersPageRedesignLabels } from "./types";

type Props = {
  requirements: GrowthPartnersPageRedesignLabels["requirements"];
};

export default function GrowthPartnerRequirementsSection({ requirements }: Props) {
  return (
    <section aria-labelledby="gp-requirements-title" className={`${PublicMarketingClasses.sectionAlt} py-16 sm:py-20`}>
      <div className={PublicMarketingClasses.containerWide}>
        <h2 id="gp-requirements-title" className={`text-center ${PublicMarketingClasses.sectionHeading}`}>
          {requirements.title}
        </h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {requirements.cards.map((card) => (
            <div key={card.title} className={PublicMarketingClasses.card}>
              <h3 className="font-semibold text-aipify-text">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{card.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 mx-auto max-w-2xl rounded-2xl border border-aipify-border bg-aipify-surface p-6 shadow-sm">
          <h3 className="text-base font-semibold text-aipify-text">{requirements.checklistTitle}</h3>
          <ul className="mt-4 space-y-2">
            {requirements.checklistItems.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-aipify-text-secondary">
                <span className="text-aipify-companion" aria-hidden="true">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-aipify-text-muted">{requirements.copy}</p>
        </div>
      </div>
    </section>
  );
}
