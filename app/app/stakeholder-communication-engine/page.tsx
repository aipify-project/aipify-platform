import { StakeholderCommunicationEngineDashboardPanel } from "@/components/app/stakeholder-communication-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function StakeholderCommunicationEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "stakeholderCommunicationEngine");
  const t = createTranslator(dict);
  const p = "customerApp.stakeholderCommunicationEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <StakeholderCommunicationEngineDashboardPanel labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          summary: t(`${p}.summary`),
          principles: t(`${p}.principles`),
          campaigns: t(`${p}.campaigns`),
          deliveries: t(`${p}.deliveries`),
          executiveSummary: t(`${p}.executiveSummary`),
          integrationSummaries: t(`${p}.integrationSummaries`),
          stakeholderType: t(`${p}.stakeholderType`),
          schedule: t(`${p}.schedule`),
          publish: t(`${p}.publish`),
          cancel: t(`${p}.cancel`),
          export: t(`${p}.export`),
          scheduling: t(`${p}.scheduling`),
          publishing: t(`${p}.publishing`),
          cancelling: t(`${p}.cancelling`),
          exporting: t(`${p}.exporting`),
          scheduleFailed: t(`${p}.scheduleFailed`),
          publishFailed: t(`${p}.publishFailed`),
          cancelFailed: t(`${p}.cancelFailed`),
          exportFailed: t(`${p}.exportFailed`),
        }} />
    </div>
  );
}
