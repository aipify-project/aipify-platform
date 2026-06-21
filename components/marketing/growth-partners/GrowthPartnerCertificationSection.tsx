import { PartnerAdvisorCard } from "@/components/marketing/PartnerAdvisorCard";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import type { GrowthPartnersPageRedesignLabels } from "./types";
import type { PartnerAdvisorLabels } from "@/components/marketing/PartnerAdvisorCard";

type Props = {
  certification: GrowthPartnersPageRedesignLabels["certification"];
  partnerAdvisor: PartnerAdvisorLabels;
};

export default function GrowthPartnerCertificationSection({ certification, partnerAdvisor }: Props) {
  return (
    <section aria-labelledby="gp-cert-title" className={`${PublicMarketingClasses.sectionAlt} py-16 sm:py-20`}>
      <div className={PublicMarketingClasses.containerWide}>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-start">
          <div>
            <h2 id="gp-cert-title" className={PublicMarketingClasses.sectionHeading}>{certification.title}</h2>
            <p className="mt-4 text-lg leading-relaxed text-aipify-text-secondary">{certification.intro}</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {certification.topics.map((topic) => (
                <li
                  key={topic}
                  className="rounded-xl border border-aipify-border bg-aipify-surface px-4 py-3 text-sm font-medium text-aipify-text-secondary"
                >
                  {topic}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-aipify-text-muted">{certification.note}</p>
          </div>
          <PartnerAdvisorCard labels={partnerAdvisor} />
        </div>
      </div>
    </section>
  );
}
