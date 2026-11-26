import { CertifiedSalesPartnerMarketingCenter } from "@/components/partners-portal/CertifiedSalesPartnerMarketingCenter";
import { CertifiedSalesPartnerWorkspacePanel } from "@/components/partners-portal/CertifiedSalesPartnerWorkspacePanel";
import { buildCspMarketingLabels, buildCspWorkspaceLabels } from "@/lib/partners-portal/csp-workspace-labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PartnersMarketingAssetsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["partnersPortal"]);
  const t = createTranslator(dict);
  const labels = buildCspWorkspaceLabels(
    t,
    "partnersPortal.certifiedSalesPartner.pages.marketing.title",
    "partnersPortal.certifiedSalesPartner.pages.marketing.subtitle",
  );
  return (
    <CertifiedSalesPartnerWorkspacePanel labels={labels}>
      <CertifiedSalesPartnerMarketingCenter labels={buildCspMarketingLabels(t)} locale={locale} />
    </CertifiedSalesPartnerWorkspacePanel>
  );
}
