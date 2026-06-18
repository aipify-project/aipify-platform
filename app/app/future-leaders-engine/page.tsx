import { FutureLeadersEngineDashboardPanel } from "@/components/app/future-leaders-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function FutureLeadersEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "futureLeadersEngine");
  const t = createTranslator(dict);
  const p = "customerApp.futureLeadersEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <FutureLeadersEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          developmentScore: t(`${p}.developmentScore`),
          distinctionNote: t(`${p}.distinctionNote`),
          developmentMode: t(`${p}.developmentMode`),
          pathwaysCount: t(`${p}.pathwaysCount`),
          activeMentorships: t(`${p}.activeMentorships`),
          leadershipMemory: t(`${p}.leadershipMemory`),
          enableRequired: t(`${p}.enableRequired`),
          futureLeadersCenter: t(`${p}.futureLeadersCenter`),
          intergenerationalLearning: t(`${p}.intergenerationalLearning`),
          successionPreparedness: t(`${p}.successionPreparedness`),
          leadershipCompanion: t(`${p}.leadershipCompanion`),
          mentorshipNetwork: t(`${p}.mentorshipNetwork`),
          leadershipMemoryEngine: t(`${p}.leadershipMemoryEngine`),
          emergingLeaderPathways: t(`${p}.emergingLeaderPathways`),
          pathwaysEnrolled: t(`${p}.pathwaysEnrolled`),
          mentorshipPrograms: t(`${p}.mentorshipPrograms`),
          leadershipMemoryEntries: t(`${p}.leadershipMemoryEntries`),
          successionReviews: t(`${p}.successionReviews`),
          crossLinks: t(`${p}.crossLinks`),
          blueprintObjectives: t(`${p}.blueprintObjectives`),
          companionLimitations: t(`${p}.companionLimitations`),
          successCriteria: t(`${p}.successCriteria`),
          criterionMet: t(`${p}.criterionMet`),
          criterionPending: t(`${p}.criterionPending`),
        }}
      />
    </div>
  );
}
