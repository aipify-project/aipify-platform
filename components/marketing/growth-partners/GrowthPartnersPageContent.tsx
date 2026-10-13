import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import GrowthPartnerBusinessModelSection from "./GrowthPartnerBusinessModelSection";
import GrowthPartnerCertificationSection from "./GrowthPartnerCertificationSection";
import GrowthPartnerCommissionSection from "./GrowthPartnerCommissionSection";
import GrowthPartnerFaqAccordion from "./GrowthPartnerFaqAccordion";
import GrowthPartnerFinalCta from "./GrowthPartnerFinalCta";
import GrowthPartnerHeroWithForm from "./GrowthPartnerHeroWithForm";
import GrowthPartnerJourney from "./GrowthPartnerJourney";
import GrowthPartnerPortalPreview from "./GrowthPartnerPortalPreview";
import GrowthPartnerRequirementsSection from "./GrowthPartnerRequirementsSection";
import GrowthPartnerSplitSection from "./GrowthPartnerSplitSection";
import type { GrowthPartnersPageContentProps } from "./types";

export type { GrowthPartnersPageRedesignLabels as GrowthPartnersPageLabels } from "./types";

export default function GrowthPartnersPageContent({ labels, verificationLabels }: GrowthPartnersPageContentProps) {
  return (
    <div className="bg-[#f3f5fb] text-[#1f2235]">
      <GrowthPartnerHeroWithForm labels={labels} verificationLabels={verificationLabels} />
      <div className="space-y-2 pb-4">
        <GrowthPartnerSplitSection split={labels.split} />
        <GrowthPartnerPortalPreview portal={labels.portalPreview} />
        <GrowthPartnerJourney journey={labels.journey} />
        <GrowthPartnerCertificationSection
          certification={labels.certification}
          partnerAdvisor={labels.partnerAdvisor}
        />
        <GrowthPartnerCommissionSection commission={labels.commission} />
        <GrowthPartnerRequirementsSection requirements={labels.requirements} />
        <GrowthPartnerBusinessModelSection businessModel={labels.businessModel} />
        <GrowthPartnerFaqAccordion faq={labels.faq} />
        <GrowthPartnerFinalCta finalCta={labels.finalCta} />
      </div>
      <footer className={`${PublicMarketingClasses.container} pb-10 text-center text-sm text-[#687086]`}>
        {labels.footerNote}
      </footer>
    </div>
  );
}
