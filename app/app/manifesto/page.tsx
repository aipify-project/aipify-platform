import { ManifestoDashboardPanel } from "@/components/app/manifesto";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ManifestoPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.aipifyManifesto";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <ManifestoDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          visionAlignment: t(`${p}.visionAlignment`),
          generateBriefing: t(`${p}.generateBriefing`),
          themesAcknowledged: t(`${p}.themesAcknowledged`),
          alignment: t(`${p}.alignment`),
          strategicThemes: t(`${p}.strategicThemes`),
          publications: t(`${p}.publications`),
          foundingStatements: t(`${p}.foundingStatements`),
          manifestoBeliefs: t(`${p}.manifestoBeliefs`),
          belief: t(`${p}.belief`),
          acknowledged: t(`${p}.acknowledged`),
          acknowledgeTheme: t(`${p}.acknowledgeTheme`),
          visionPerspectives: t(`${p}.visionPerspectives`),
          organizationalCommitments: t(`${p}.organizationalCommitments`),
          visionUpdates: t(`${p}.visionUpdates`),
          completeUpdate: t(`${p}.completeUpdate`),
          visionPublications: t(`${p}.visionPublications`),
          targetAudiences: t(`${p}.targetAudiences`),
          recentBriefings: t(`${p}.recentBriefings`),
          constitution: t(`${p}.constitution`),
          academy: t(`${p}.academy`),
          knowledgeCenter: t(`${p}.knowledgeCenter`),
        }}
      />
    </div>
  );
}
