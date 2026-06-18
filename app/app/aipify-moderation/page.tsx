import { AipifyModerationDashboardPanel } from "@/components/app/aipify-moderation";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyModerationPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "aipifyModeration");
  const t = createTranslator(dict);
  const p = "customerApp.aipifyModeration";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <p className="text-sm font-medium text-indigo-700">{t(`${p}.moduleLabel`)}</p>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 max-w-3xl text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyModerationDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          suggestOnlyBanner: t(`${p}.suggestOnlyBanner`),
          metricPending: t(`${p}.metricPending`),
          metricAutoApproved: t(`${p}.metricAutoApproved`),
          metricManualQueue: t(`${p}.metricManualQueue`),
          metricQueueReduction: t(`${p}.metricQueueReduction`),
          learningInsights: t(`${p}.learningInsights`),
          emptyQueue: t(`${p}.emptyQueue`),
          noPreview: t(`${p}.noPreview`),
          confidence: t(`${p}.confidence`),
          highRisk: t(`${p}.highRisk`),
          reported: t(`${p}.reported`),
          source: t(`${p}.source`),
          priority: t(`${p}.priority`),
          categories: t(`${p}.categories`),
          riskFlags: t(`${p}.riskFlags`),
          approve: t(`${p}.approve`),
          reject: t(`${p}.reject`),
          requestNewUpload: t(`${p}.requestNewUpload`),
          escalate: t(`${p}.escalate`),
          finalDecision: t(`${p}.finalDecision`),
          decision_auto_approve: t(`${p}.decisionAutoApprove`),
          decision_manual_review: t(`${p}.decisionManualReview`),
          decision_auto_reject: t(`${p}.decisionAutoReject`),
          tab_needs_review: t(`${p}.tabNeedsReview`),
          tab_auto_approved: t(`${p}.tabAutoApproved`),
          tab_auto_rejected: t(`${p}.tabAutoRejected`),
          tab_high_risk: t(`${p}.tabHighRisk`),
          tab_reported: t(`${p}.tabReported`),
          tab_history: t(`${p}.tabHistory`),
        }}
      />
    </div>
  );
}
