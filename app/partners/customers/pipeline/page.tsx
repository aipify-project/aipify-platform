import { CertifiedSalesPartnerSalesPanel } from "@/components/partners-portal/CertifiedSalesPartnerPortalPanels";
import { CertifiedSalesPartnerWorkspacePanel } from "@/components/partners-portal/CertifiedSalesPartnerWorkspacePanel";
import { buildCspSalesLabels, buildCspWorkspaceLabels } from "@/lib/partners-portal/csp-workspace-labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PartnersSalesPipelinePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["partnersPortal"]);
  const t = createTranslator(dict);
  const labels = buildCspWorkspaceLabels(
    t,
    "partnersPortal.certifiedSalesPartner.pages.sales.title",
    "partnersPortal.certifiedSalesPartner.pages.sales.subtitle",
  );
  return (
    <CertifiedSalesPartnerWorkspacePanel labels={labels}>
      <CertifiedSalesPartnerSalesPanel labels={buildCspSalesLabels(t)} locale={locale} />
    </CertifiedSalesPartnerWorkspacePanel>
  );
}
