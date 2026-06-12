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
          companionIdentity: t(`${p}.companionIdentity`),
          selfLove: t(`${p}.selfLove`),
          license: t(`${p}.license`),
          academy: t(`${p}.academy`),
          knowledgeCenter: t(`${p}.knowledgeCenter`),
          humanCenteredCompanionshipTitle: t(`${p}.humanCenteredCompanionship.title`),
          ourBeliefs: t(`${p}.humanCenteredCompanionship.ourBeliefs`),
          ourPrinciples: t(`${p}.humanCenteredCompanionship.ourPrinciples`),
          whatAipifyIs: t(`${p}.humanCenteredCompanionship.whatAipifyIs`),
          whatAipifyIsNot: t(`${p}.humanCenteredCompanionship.whatAipifyIsNot`),
          trustedCompanionVision: t(`${p}.humanCenteredCompanionship.trustedCompanionVision`),
          foundationalPrinciples: t(`${p}.humanCenteredCompanionship.foundationalPrinciples`),
          ourHope: t(`${p}.humanCenteredCompanionship.ourHope`),
          hope: t(`${p}.humanCenteredCompanionship.hope`),
          ourResponsibility: t(`${p}.humanCenteredCompanionship.ourResponsibility`),
          theFuture: t(`${p}.humanCenteredCompanionship.theFuture`),
          messageToFutureBuilders: t(`${p}.humanCenteredCompanionship.messageToFutureBuilders`),
          successCriteria: t(`${p}.humanCenteredCompanionship.successCriteria`),
          criterionMet: t(`${p}.humanCenteredCompanionship.criterionMet`),
          criterionPending: t(`${p}.humanCenteredCompanionship.criterionPending`),
          integrationLinks: t(`${p}.humanCenteredCompanionship.integrationLinks`),
          viewRelated: t(`${p}.humanCenteredCompanionship.viewRelated`),
        }}
      />
    </div>
  );
}
