import { CertifiedSalesPartnerTrainingClient } from "@/components/partners-portal/CertifiedSalesPartnerTrainingClient";
import { CertifiedSalesPartnerWorkspacePanel } from "@/components/partners-portal/CertifiedSalesPartnerWorkspacePanel";
import {
  buildCspExamLabels,
  buildCspLessonsLabels,
  buildCspWorkspaceLabels,
} from "@/lib/partners-portal/csp-workspace-labels";
import { buildAcademyExperience } from "@/lib/partners-portal/sales-experience-content";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PartnersAcademyTrainingPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["partnersPortal"]);
  const t = createTranslator(dict);
  const labels = buildCspWorkspaceLabels(
    t,
    "partnersPortal.certifiedSalesPartner.pages.academy.title",
    "partnersPortal.certifiedSalesPartner.pages.academy.subtitle",
  );
  const hub = "partnersPortal.certifiedSalesPartner.academyHub";
  return (
    <CertifiedSalesPartnerWorkspacePanel labels={labels}>
      <CertifiedSalesPartnerTrainingClient
        locale={locale}
        lessonsLabels={buildCspLessonsLabels(t)}
        examLabels={buildCspExamLabels(t)}
        hubLabels={{
          productTabsLabel: t(`${hub}.productTabsLabel`),
          kompisWeb: t(`${hub}.kompisWeb`),
          kompisBedrift: t(`${hub}.kompisBedrift`),
          bedriftNotPublishedTitle: t(`${hub}.bedriftNotPublishedTitle`),
          bedriftNotPublishedBody: t(`${hub}.bedriftNotPublishedBody`),
          voiceFuture: t(`${hub}.voiceFuture`),
          voiceFutureBody: t(`${hub}.voiceFutureBody`),
        }}
        learning={buildAcademyExperience(t)}
      />
    </CertifiedSalesPartnerWorkspacePanel>
  );
}
