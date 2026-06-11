import { ConstitutionDashboardPanel } from "@/components/app/constitution";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ConstitutionPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.aipifyConstitution";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <ConstitutionDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          constitutionalAlignment: t(`${p}.constitutionalAlignment`),
          generateBriefing: t(`${p}.generateBriefing`),
          principlesAcknowledged: t(`${p}.principlesAcknowledged`),
          alignment: t(`${p}.alignment`),
          corePrinciples: t(`${p}.corePrinciples`),
          partnerAlignment: t(`${p}.partnerAlignment`),
          principle: t(`${p}.principle`),
          acknowledged: t(`${p}.acknowledged`),
          acknowledgePrinciple: t(`${p}.acknowledgePrinciple`),
          responsibleAi: t(`${p}.responsibleAi`),
          decisionFramework: t(`${p}.decisionFramework`),
          commitments: t(`${p}.commitments`),
          constitutionalReviews: t(`${p}.constitutionalReviews`),
          completeReview: t(`${p}.completeReview`),
          partnerAlignmentSection: t(`${p}.partnerAlignmentSection`),
          governanceDecisions: t(`${p}.governanceDecisions`),
          reviewProcess: t(`${p}.reviewProcess`),
          recentBriefings: t(`${p}.recentBriefings`),
          governance: t(`${p}.governance`),
          partners: t(`${p}.partners`),
          knowledgeCenter: t(`${p}.knowledgeCenter`),
        }}
      />
    </div>
  );
}
