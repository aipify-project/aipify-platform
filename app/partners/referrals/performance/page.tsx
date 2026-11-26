import { CertifiedSalesPartnerSalesPanel } from "@/components/partners-portal/CertifiedSalesPartnerPortalPanels";
import { renderCspSectionPage } from "@/lib/partners-portal/csp-section-page";
import { buildCspSalesLabels } from "@/lib/partners-portal/csp-workspace-labels";

/** Referral performance — same authoritative CSP sales data as Mine salg. */
export default function PartnersReferralPerformancePage() {
  return renderCspSectionPage({
    titleKey: "partnersPortal.certifiedSalesPartner.pages.sales.title",
    subtitleKey: "partnersPortal.certifiedSalesPartner.pages.sales.subtitle",
    children: ({ locale, t }) => (
      <CertifiedSalesPartnerSalesPanel labels={buildCspSalesLabels(t)} locale={locale} />
    ),
  });
}
