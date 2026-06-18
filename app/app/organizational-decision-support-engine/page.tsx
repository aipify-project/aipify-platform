import { OrganizationalDecisionSupportEngineDashboardPanel } from "@/components/app/organizational-decision-support-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalDecisionSupportEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "organizationalDecisionSupportEngine");
  const t = createTranslator(dict);
  const p = "customerApp.organizationalDecisionSupportEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <OrganizationalDecisionSupportEngineDashboardPanel labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          distinctionNote: t(`${p}.distinctionNote`),
          summary: t(`${p}.summary`),
          principles: t(`${p}.principles`),
          decisions: t(`${p}.decisions`),
          outcomes: t(`${p}.outcomes`),
          executiveSummary: t(`${p}.executiveSummary`),
          integrationSummaries: t(`${p}.integrationSummaries`),
          confidence: t(`${p}.confidence`),
          startReview: t(`${p}.startReview`),
          approve: t(`${p}.approve`),
          reject: t(`${p}.reject`),
          markImplemented: t(`${p}.markImplemented`),
          reviewing: t(`${p}.reviewing`),
          approving: t(`${p}.approving`),
          rejecting: t(`${p}.rejecting`),
          implementing: t(`${p}.implementing`),
          exportReport: t(`${p}.exportReport`),
          exporting: t(`${p}.exporting`),
          reviewFailed: t(`${p}.reviewFailed`),
          approveFailed: t(`${p}.approveFailed`),
          rejectFailed: t(`${p}.rejectFailed`),
          implementFailed: t(`${p}.implementFailed`),
          exportFailed: t(`${p}.exportFailed`),
        }} />
    </div>
  );
}
