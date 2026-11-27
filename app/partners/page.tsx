import { CertifiedSalesPartnerOverviewPanel } from "@/components/partners-portal/CertifiedSalesPartnerPortalPanels";
import { CertifiedSalesPartnerWorkspacePanel } from "@/components/partners-portal/CertifiedSalesPartnerWorkspacePanel";
import { buildCspOverviewLabels, buildCspWorkspaceLabels } from "@/lib/partners-portal/csp-workspace-labels";
import { buildHomeExperience } from "@/lib/partners-portal/sales-experience-content";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PartnersHomePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["partnersPortal"]);
  const t = createTranslator(dict);
  const labels = buildCspWorkspaceLabels(
    t,
    "partnersPortal.certifiedSalesPartner.pages.home.title",
    "partnersPortal.certifiedSalesPartner.pages.home.subtitle",
  );
  return (
    <CertifiedSalesPartnerWorkspacePanel labels={labels}>
      <CertifiedSalesPartnerOverviewPanel
        labels={buildCspOverviewLabels(t)}
        locale={locale}
        experience={buildHomeExperience(t)}
      />
    </CertifiedSalesPartnerWorkspacePanel>
  );
}
