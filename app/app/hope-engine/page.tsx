import { HopeEngineDashboardPanel } from "@/components/app/hope-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function HopeEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.hopeEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <HopeEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          distinctionNote: t(`${p}.distinctionNote`),
          summary: t(`${p}.summary`),
          signalCount: t(`${p}.signalCount`),
          pendingReflections: t(`${p}.pendingReflections`),
          realisticEncouragement: t(`${p}.realisticEncouragement`),
          highlightProgress: t(`${p}.highlightProgress`),
          yes: t(`${p}.yes`),
          no: t(`${p}.no`),
          whenHopeMatters: t(`${p}.whenHopeMatters`),
          communicationPrinciples: t(`${p}.communicationPrinciples`),
          examplePhrases: t(`${p}.examplePhrases`),
          recentSignals: t(`${p}.recentSignals`),
          pendingReflectionsTitle: t(`${p}.pendingReflectionsTitle`),
          acknowledge: t(`${p}.acknowledge`),
          dismiss: t(`${p}.dismiss`),
          selfLoveNote: t(`${p}.selfLoveNote`),
          dedicationNote: t(`${p}.dedicationNote`),
          impactNote: t(`${p}.impactNote`),
          boundaryPhrases: t(`${p}.boundaryPhrases`),
          avoidPhrases: t(`${p}.avoidPhrases`),
          preferPhrases: t(`${p}.preferPhrases`),
          hopeSettings: t(`${p}.hopeSettings`),
          realisticEncouragementToggle: t(`${p}.realisticEncouragementToggle`),
          highlightProgressToggle: t(`${p}.highlightProgressToggle`),
          balanceSelfLoveToggle: t(`${p}.balanceSelfLoveToggle`),
          saveSettings: t(`${p}.saveSettings`),
          saving: t(`${p}.saving`),
          settingsFailed: t(`${p}.settingsFailed`),
          actionFailed: t(`${p}.actionFailed`),
          integrationLinks: t(`${p}.integrationLinks`),
          exportReport: t(`${p}.exportReport`),
          exporting: t(`${p}.exporting`),
          exportFailed: t(`${p}.exportFailed`),
        }}
      />
    </div>
  );
}
