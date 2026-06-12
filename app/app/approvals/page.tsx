import { AipifyCompanionBriefingBanner } from "@/components/app/briefing";
import { ApprovalsCenterPanel } from "@/components/app/approvals/ApprovalsCenterPanel";
import { buildCompanionBriefingLabels } from "@/lib/app/companion-briefing-labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ApprovalsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp", "branding"]);
  const t = createTranslator(dict);

  return (
    <div className="space-y-4">
      <div className="px-6 pt-6">
        <AipifyCompanionBriefingBanner
          context="approvals"
          labels={buildCompanionBriefingLabels(t)}
        />
      </div>
      <ApprovalsCenterPanel
      locale={locale}
      labels={{
        title: t("customerApp.approvals.title"),
        subtitle: t("customerApp.approvals.subtitle"),
        loading: t("customerApp.approvals.loading"),
        empty: t("customerApp.approvals.empty"),
        pulseLabel: t("branding.pulseLabel"),
        openActionCenter: t("customerApp.approvals.openActionCenter"),
        approve: t("customerApp.approvals.approve"),
        reject: t("customerApp.approvals.reject"),
        executing: t("customerApp.approvals.executing"),
        emergencyStop: t("customerApp.approvals.emergencyStop"),
        emergencyActive: t("customerApp.approvals.emergencyActive"),
        actionCategories: t("customerApp.approvals.actionCategories"),
        successCriteria: t("customerApp.approvals.successCriteria"),
        integrationLinks: t("customerApp.approvals.integrationLinks"),
        riskLevels: {
          "0": t("customerApp.approvals.riskLevels.information"),
          "1": t("customerApp.approvals.riskLevels.low"),
          "2": t("customerApp.approvals.riskLevels.medium"),
          "3": t("customerApp.approvals.riskLevels.high"),
          "4": t("customerApp.approvals.riskLevels.critical"),
          low: t("customerApp.approvals.riskLevels.low"),
          medium: t("customerApp.approvals.riskLevels.medium"),
          high: t("customerApp.approvals.riskLevels.high"),
          critical: t("customerApp.approvals.riskLevels.critical"),
        },
        fields: {
          skill: t("customerApp.approvals.fields.skill"),
          confidence: t("customerApp.approvals.fields.confidence"),
          approver: t("customerApp.approvals.fields.approver"),
          reasoning: t("customerApp.approvals.fields.reasoning"),
        },
        statusLabels: {
          pending: t("customerApp.approvals.statusLabels.pending"),
          approved: t("customerApp.approvals.statusLabels.approved"),
          rejected: t("customerApp.approvals.statusLabels.rejected"),
          completed: t("customerApp.approvals.statusLabels.completed"),
        },
        categoryLabels: {
          notification: t("customerApp.approvals.categoryLabels.notification"),
          recommendation: t("customerApp.approvals.categoryLabels.recommendation"),
          automation: t("customerApp.approvals.categoryLabels.automation"),
          integration: t("customerApp.approvals.categoryLabels.integration"),
          update: t("customerApp.approvals.categoryLabels.update"),
          action: t("customerApp.approvals.categoryLabels.action"),
        },
      }}
    />
    </div>
  );
}
