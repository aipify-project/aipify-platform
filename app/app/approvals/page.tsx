import { AipifyCompanionBriefingBanner } from "@/components/app/briefing";
import { ApprovalsCenterPanel } from "@/components/app/approvals/ApprovalsCenterPanel";
import { buildCompanionActionApprovalLabels } from "@/lib/companion-action-approval/labels";
import { buildCompanionBriefingLabels } from "@/lib/app/companion-briefing-labels";
import { getCustomerAppDictionaryForSplits, getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ApprovalsPage() {
  const locale = await getLocale();
  const [dashboardDict, brandingDict, companionActionApprovalDict] = await Promise.all([
    getCustomerAppDictionaryForSplits(locale, ["dashboard"]),
    getDictionary(locale, ["branding"]),
    getDictionary(locale, ["companionActionApproval"]),
  ]);
  const dict = { ...dashboardDict, ...brandingDict };
  const t = createTranslator(dict);
  const companionLabels = buildCompanionActionApprovalLabels(
    createTranslator(companionActionApprovalDict),
  );

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
          trustSection: t("customerApp.approvals.trustSection"),
          trustLoadError: t("customerApp.approvals.trustLoadError"),
          retry: t("customerApp.approvals.retry"),
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
          companion: {
            section: t("customerApp.approvals.companionSection"),
            empty: t("customerApp.approvals.companionEmpty"),
            loadError: companionLabels.errorMessage,
            openCenter: companionLabels.title,
            reason: companionLabels.reason,
            expires: companionLabels.expires,
            category: companionLabels.category,
            statusLabels: {
              pending: companionLabels.status_pending,
              awaiting_approval: companionLabels.status_pending,
              approved: companionLabels.status_approved,
              rejected: companionLabels.status_rejected,
              status_pending: companionLabels.status_pending,
              status_approved: companionLabels.status_approved,
              status_rejected: companionLabels.status_rejected,
            },
          },
          confirmed: t("customerApp.approvals.confirmed"),
          receipt: {
            title: t("customerApp.approvals.receipt.title"),
            copy: t("customerApp.approvals.receipt.copy"),
            copied: t("customerApp.approvals.receipt.copied"),
            approvedBy: t("customerApp.approvals.receipt.approvedBy"),
            approverRole: t("customerApp.approvals.receipt.approverRole"),
            approvedAt: t("customerApp.approvals.receipt.approvedAt"),
            action: t("customerApp.approvals.receipt.action"),
            scope: t("customerApp.approvals.receipt.scope"),
            target: t("customerApp.approvals.receipt.target"),
            validity: t("customerApp.approvals.receipt.validity"),
            oneTime: t("customerApp.approvals.receipt.oneTime"),
            ongoing: t("customerApp.approvals.receipt.ongoing"),
            expiresAt: t("customerApp.approvals.receipt.expiresAt"),
            auditId: t("customerApp.approvals.receipt.auditId"),
            correlationId: t("customerApp.approvals.receipt.correlationId"),
            status: t("customerApp.approvals.receipt.status"),
            executionResult: t("customerApp.approvals.receipt.executionResult"),
            unchanged: t("customerApp.approvals.receipt.unchanged"),
            notAvailable: t("customerApp.approvals.receipt.notAvailable"),
          },
        }}
      />
    </div>
  );
}
