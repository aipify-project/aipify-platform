import { EvolutionBoardPanel } from "@/components/app/global-learning";
import { EvolutionGovernanceBoardPanel } from "@/components/app/evolution-governance";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function EvolutionPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const g = "customerApp.evolutionGovernance";
  const c = "customerApp.evolution";

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${g}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${g}.subtitle`)}</p>
      </div>

      <EvolutionGovernanceBoardPanel
        labels={{
          loading: t(`${g}.loading`),
          governanceTitle: t(`${g}.governanceTitle`),
          generateBriefing: t(`${g}.generateBriefing`),
          approvalMatrix: t(`${g}.approvalMatrix`),
          openProposals: t(`${g}.openProposals`),
          noProposals: t(`${g}.noProposals`),
          expectedBenefits: t(`${g}.expectedBenefits`),
          potentialRisks: t(`${g}.potentialRisks`),
          implementationRecommendation: t(`${g}.implementationRecommendation`),
          rollbackGuidance: t(`${g}.rollbackGuidance`),
          reviewApprove: t(`${g}.reviewApprove`),
          approve: t(`${g}.approve`),
          reject: t(`${g}.reject`),
          schedule: t(`${g}.schedule`),
          implement: t(`${g}.implement`),
          validate: t(`${g}.validate`),
          rollback: t(`${g}.rollback`),
          changeHistory: t(`${g}.changeHistory`),
          briefings: t(`${g}.briefings`),
          integrations: t(`${g}.integrations`),
        }}
      />

      <section className="border-t border-gray-200 pt-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{t(`${c}.coreTitle`)}</h2>
          <p className="mt-1 text-sm text-gray-600">{t(`${c}.coreSubtitle`)}</p>
        </div>
        <div className="mt-4">
          <EvolutionBoardPanel
            labels={{
              loading: t(`${c}.loading`),
              back: t(`${c}.back`),
              trendSummaries: t(`${c}.trendSummaries`),
              proposals: t(`${c}.proposals`),
              noProposals: t(`${c}.noProposals`),
              signals: t(`${c}.signals`),
              expectedValue: t(`${c}.expectedValue`),
              confidence: t(`${c}.confidence`),
              recommendedAction: t(`${c}.recommendedAction`),
              yourFeedback: t(`${c}.yourFeedback`),
              approve: t(`${c}.approve`),
              reject: t(`${c}.reject`),
              snooze: t(`${c}.snooze`),
              requestInfo: t(`${c}.requestInfo`),
            }}
          />
        </div>
      </section>
    </div>
  );
}
