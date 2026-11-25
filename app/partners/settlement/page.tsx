import { CertifiedSalesPartnerSettlementsPanel } from "@/components/partners-portal/CertifiedSalesPartnerPortalPanels";
import { CertifiedSalesPartnerWorkspacePanel } from "@/components/partners-portal/CertifiedSalesPartnerWorkspacePanel";
import { buildCspSettlementsLabels, buildCspWorkspaceLabels } from "@/lib/partners-portal/csp-workspace-labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PartnersSettlementPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["partnersPortal"]);
  const t = createTranslator(dict);
  const labels = buildCspWorkspaceLabels(
    t,
    "partnersPortal.certifiedSalesPartner.pages.settlement.title",
    "partnersPortal.certifiedSalesPartner.pages.settlement.subtitle",
  );
  return (
    <CertifiedSalesPartnerWorkspacePanel labels={labels}>
      <CertifiedSalesPartnerSettlementsPanel labels={buildCspSettlementsLabels(t)} locale={locale} />
    </CertifiedSalesPartnerWorkspacePanel>
  );
}
