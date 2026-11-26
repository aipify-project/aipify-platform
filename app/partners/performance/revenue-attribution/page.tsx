import { CertifiedSalesPartnerSalesPanel } from "@/components/partners-portal/CertifiedSalesPartnerPortalPanels";
import { renderCspSectionPage } from "@/lib/partners-portal/csp-section-page";
import { buildCspSalesLabels } from "@/lib/partners-portal/csp-workspace-labels";

/** Commission & sales overview — CSP sales list (not Growth Partner stubs). */
export default function PartnersCommissionPage() {
  return renderCspSectionPage({
    titleKey: "partnersPortal.certifiedSalesPartner.pages.sales.title",
    subtitleKey: "partnersPortal.certifiedSalesPartner.pages.sales.subtitle",
    children: ({ locale, t }) => (
      <CertifiedSalesPartnerSalesPanel labels={buildCspSalesLabels(t)} locale={locale} />
    ),
  });
}
