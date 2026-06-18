import { DocumentOutputEngineDashboardPanel } from "@/components/app/document-output-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DocumentOutputEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "documentOutputEngine");
  const t = createTranslator(dict);
  const p = "customerApp.documentOutputEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <DocumentOutputEngineDashboardPanel labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          trustNote: t(`${p}.trustNote`),
          summary: t(`${p}.summary`),
          templates: t(`${p}.templates`),
          generations: t(`${p}.generations`),
          schedules: t(`${p}.schedules`),
          executiveSummary: t(`${p}.executiveSummary`),
          integrationSummaries: t(`${p}.integrationSummaries`),
          generate: t(`${p}.generate`),
          generating: t(`${p}.generating`),
          generateFailed: t(`${p}.generateFailed`),
          schedule: t(`${p}.schedule`),
          scheduling: t(`${p}.scheduling`),
          scheduleFailed: t(`${p}.scheduleFailed`),
          exportManifest: t(`${p}.exportManifest`),
          exporting: t(`${p}.exporting`),
          exportFailed: t(`${p}.exportFailed`),
        }} />
    </div>
  );
}
