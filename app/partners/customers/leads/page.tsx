import { CertifiedSalesPartnerLeadsPanel } from "@/components/partners-portal/CertifiedSalesPartnerLeadsPanel";
import { renderCspSectionPage } from "@/lib/partners-portal/csp-section-page";
import { buildCspLeadsLabels } from "@/lib/partners-portal/csp-workspace-labels";

export default function PartnersLeadsPage() {
  return renderCspSectionPage({
    titleKey: "partnersPortal.certifiedSalesPartner.pages.leads.title",
    subtitleKey: "partnersPortal.certifiedSalesPartner.pages.leads.subtitle",
    children: ({ locale, t }) => <CertifiedSalesPartnerLeadsPanel labels={buildCspLeadsLabels(t)} locale={locale} />,
  });
}
