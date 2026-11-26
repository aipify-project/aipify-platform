import { CertifiedSalesPartnerCustomersPanel } from "@/components/partners-portal/CertifiedSalesPartnerCustomersPanel";
import { renderCspSectionPage } from "@/lib/partners-portal/csp-section-page";
import { buildCspCustomersLabels } from "@/lib/partners-portal/csp-workspace-labels";

/** Route stays `/partners/customers/prospects`; the nav entry is "My customers" (Mine kunder). */
export default function PartnersCustomersPage() {
  return renderCspSectionPage({
    titleKey: "partnersPortal.certifiedSalesPartner.pages.customers.title",
    subtitleKey: "partnersPortal.certifiedSalesPartner.pages.customers.subtitle",
    children: ({ locale, t }) => (
      <CertifiedSalesPartnerCustomersPanel labels={buildCspCustomersLabels(t)} locale={locale} />
    ),
  });
}
