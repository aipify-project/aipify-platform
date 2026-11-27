import { CertifiedSalesPartnerCertificationsPanel } from "@/components/partners-portal/CertifiedSalesPartnerPortalPanels";
import { CertifiedSalesPartnerWorkspacePanel } from "@/components/partners-portal/CertifiedSalesPartnerWorkspacePanel";
import { buildCspCertificationsLabels, buildCspWorkspaceLabels } from "@/lib/partners-portal/csp-workspace-labels";
import { buildAcademyExperience } from "@/lib/partners-portal/sales-experience-content";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function GrowthCertificationsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["partnersPortal"]);
  const t = createTranslator(dict);
  const labels = buildCspWorkspaceLabels(
    t,
    "partnersPortal.certifiedSalesPartner.pages.certifications.title",
    "partnersPortal.certifiedSalesPartner.pages.certifications.subtitle",
  );
  return (
    <CertifiedSalesPartnerWorkspacePanel labels={labels}>
      <CertifiedSalesPartnerCertificationsPanel
        labels={buildCspCertificationsLabels(t)}
        locale={locale}
        learning={buildAcademyExperience(t)}
      />
    </CertifiedSalesPartnerWorkspacePanel>
  );
}
