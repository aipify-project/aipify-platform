import { PartnerAbsenceCoveragePanel } from "@/components/partners/absence-coverage/PartnerAbsenceCoveragePanel";
import { AbsenceCoverageNav } from "@/components/app/absence-coverage";
import { buildAbsenceCoverageLabels } from "@/lib/absence-coverage-engine/labels";
import type { Vac606Section } from "@/lib/absence-coverage-engine/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function PartnerAbsenceCoverageSectionPage({ activeSection }: { activeSection: Vac606Section }) {
  const dict = await getDictionary(await getLocale(), ["partnersPortal"]);
  const t = createTranslator(dict);
  const labels = buildAbsenceCoverageLabels(t, "partnersPortal.absenceCoverage");

  return (
    <>
      <PartnerAbsenceCoveragePanel activeSection={activeSection} labels={labels} />
    </>
  );
}

export async function PartnerAbsenceCoverageLayoutHeader() {
  const dict = await getDictionary(await getLocale(), ["partnersPortal"]);
  const t = createTranslator(dict);
  const labels = buildAbsenceCoverageLabels(t, "partnersPortal.absenceCoverage");

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
      <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      <div className="mt-6">
        <AbsenceCoverageNav labels={labels.sections} basePath="/partners/absence" />
      </div>
    </div>
  );
}
