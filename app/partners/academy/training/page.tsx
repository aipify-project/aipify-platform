import { CertifiedSalesPartnerExamPanel } from "@/components/partners-portal/CertifiedSalesPartnerExamPanel";
import { CertifiedSalesPartnerWorkspacePanel } from "@/components/partners-portal/CertifiedSalesPartnerWorkspacePanel";
import { buildCspWorkspaceLabels } from "@/lib/partners-portal/csp-workspace-labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PartnersAcademyTrainingPage() {
  const dict = await getDictionary(await getLocale(), ["partnersPortal"]);
  const t = createTranslator(dict);
  const labels = buildCspWorkspaceLabels(
    t,
    "partnersPortal.certifiedSalesPartner.pages.academy.title",
    "partnersPortal.certifiedSalesPartner.pages.academy.subtitle",
  );
  return (
    <CertifiedSalesPartnerWorkspacePanel labels={labels}>
      <CertifiedSalesPartnerExamPanel
        labels={{
          title: t("partnersPortal.certifiedSalesPartner.exam.title"),
          courseId: t("partnersPortal.certifiedSalesPartner.exam.courseId"),
          answersJson: t("partnersPortal.certifiedSalesPartner.exam.answersJson"),
          submit: t("partnersPortal.certifiedSalesPartner.exam.submit"),
          kompisBlocked: t("partnersPortal.certifiedSalesPartner.exam.kompisBlocked"),
          failClosed: t("partnersPortal.certifiedSalesPartner.workspace.notReadyBody"),
          error: t("partnersPortal.certifiedSalesPartner.workspace.errorTitle"),
          passed: t("partnersPortal.certifiedSalesPartner.exam.passed"),
          failed: t("partnersPortal.certifiedSalesPartner.exam.failed"),
        }}
      />
    </CertifiedSalesPartnerWorkspacePanel>
  );
}
