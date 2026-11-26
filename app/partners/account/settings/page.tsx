import {
  CertifiedSalesPartnerHelpPanel,
  buildCspHelpLabels,
} from "@/components/partners-portal/CertifiedSalesPartnerHelpPanel";
import { renderCspSectionPage } from "@/lib/partners-portal/csp-section-page";

export default function PartnersHelpPage() {
  return renderCspSectionPage({
    titleKey: "partnersPortal.certifiedSalesPartner.help.title",
    subtitleKey: "partnersPortal.certifiedSalesPartner.help.intro",
    children: ({ t }) => <CertifiedSalesPartnerHelpPanel labels={buildCspHelpLabels(t)} />,
  });
}
