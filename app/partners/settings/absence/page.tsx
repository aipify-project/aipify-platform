import { AbsenceCoverageSettingsPanel } from "@/components/app/absence-coverage/AbsenceCoverageSettingsPanel";
import { buildAbsenceCoverageLabels } from "@/lib/absence-coverage-engine/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PartnerAbsenceSettingsPage() {
  const dict = await getDictionary(await getLocale(), ["partnersPortal"]);
  const t = createTranslator(dict);
  const labels = buildAbsenceCoverageLabels(t, "partnersPortal.absenceCoverage");

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.settingsTitle}</h1>
        <p className="mt-2 text-gray-600">{labels.settingsSubtitle}</p>
      </div>
      <AbsenceCoverageSettingsPanel labels={labels} apiBase="/api/partners/absence/settings" />
    </div>
  );
}
