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
    <>
      <GrowthPartnerHeroWithForm labels={labels} verificationLabels={verificationLabels} />
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
      <footer className={`${PublicMarketingClasses.container} pb-10 text-center text-sm text-aipify-text-muted`}>
        {labels.footerNote}
      </footer>
    </>
  );
}
