import { ApprovalHumanOversightPanel } from "@/components/app/governance/ApprovalHumanOversightPanel";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ApprovalHumanOversightPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["core"]);
  const t = createTranslator(dict);
  const p = "customerApp.approvalHumanOversight";

  return (
    <ApprovalHumanOversightPanel
      locale={locale}
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        governanceLink: t(`${p}.governanceLink`),
        trustApprovalsLink: t(`${p}.trustApprovalsLink`),
        approvalProfilesLink: t(`${p}.approvalProfilesLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        pendingTitle: t(`${p}.pendingTitle`),
        completedTitle: t(`${p}.completedTitle`),
        recommendationsTitle: t(`${p}.recommendationsTitle`),
        executiveTitle: t(`${p}.executiveTitle`),
        emptyPending: t(`${p}.emptyPending`),
        emptyRecommendations: t(`${p}.emptyRecommendations`),
        whyAipifyRecommends: t(`${p}.whyAipifyRecommends`),
        riskLevel: t(`${p}.riskLevel`),
        businessImpact: t(`${p}.businessImpact`),
        financialImpact: t(`${p}.financialImpact`),
        ifApproved: t(`${p}.ifApproved`),
        ifRejected: t(`${p}.ifRejected`),
        risks: t(`${p}.risks`),
        approve: t(`${p}.approve`),
        reject: t(`${p}.reject`),
        delegate: t(`${p}.delegate`),
        requestInfo: t(`${p}.requestInfo`),
        snooze: t(`${p}.snooze`),
        dismiss: t(`${p}.dismiss`),
        delegatedTo: t(`${p}.delegatedTo`),
        categories: {
          personal: t(`${p}.categories.personal`),
          business: t(`${p}.categories.business`),
          financial: t(`${p}.categories.financial`),
          technical: t(`${p}.categories.technical`),
          executive: t(`${p}.categories.executive`),
        },
        riskLevels: {
          low: t(`${p}.riskLevels.low`),
          moderate: t(`${p}.riskLevels.moderate`),
          elevated: t(`${p}.riskLevels.elevated`),
          high: t(`${p}.riskLevels.high`),
        },
        priorities: {
          low: t(`${p}.priorities.low`),
          medium: t(`${p}.priorities.medium`),
          high: t(`${p}.priorities.high`),
          critical: t(`${p}.priorities.critical`),
        },
        metrics: {
          pending: t(`${p}.metrics.pending`),
          highPriority: t(`${p}.metrics.highPriority`),
          delegated: t(`${p}.metrics.delegated`),
          completed7d: t(`${p}.metrics.completed7d`),
          avgResponse: t(`${p}.metrics.avgResponse`),
          compliance: t(`${p}.metrics.compliance`),
        },
        privacyNote: t(`${p}.privacyNote`),
      }}
    />
  );
}
