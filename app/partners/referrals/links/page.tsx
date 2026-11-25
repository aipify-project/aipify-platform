import { CertifiedSalesPartnerLinkPanel } from "@/components/partners-portal/CertifiedSalesPartnerLinkPanel";
import { CertifiedSalesPartnerWorkspacePanel } from "@/components/partners-portal/CertifiedSalesPartnerWorkspacePanel";
import { buildCspLinkLabels, buildCspWorkspaceLabels } from "@/lib/partners-portal/csp-workspace-labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PartnersSalesLinksPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["partnersPortal"]);
  const t = createTranslator(dict);
  const labels = buildCspWorkspaceLabels(
    t,
    "partnersPortal.certifiedSalesPartner.pages.links.title",
    "partnersPortal.certifiedSalesPartner.pages.links.subtitle",
  );
  return (
    <CertifiedSalesPartnerWorkspacePanel labels={labels}>
      <CertifiedSalesPartnerLinkPanel labels={buildCspLinkLabels(t)} locale={locale} />
    </CertifiedSalesPartnerWorkspacePanel>
  );
}
