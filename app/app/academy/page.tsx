import { AcademyDashboardPanel } from "@/components/app/academy";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AcademyPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.aipifyAcademy";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AcademyDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          learningReadiness: t(`${p}.learningReadiness`),
          generateBriefing: t(`${p}.generateBriefing`),
          completionRate: t(`${p}.completionRate`),
          participation: t(`${p}.participation`),
          coursesCompleted: t(`${p}.coursesCompleted`),
          coursesInProgress: t(`${p}.coursesInProgress`),
          certificationProgress: t(`${p}.certificationProgress`),
          digitalBadges: t(`${p}.digitalBadges`),
          learningPillars: t(`${p}.learningPillars`),
          learningPaths: t(`${p}.learningPaths`),
          filterAll: t(`${p}.filterAll`),
          courses: t(`${p}.courses`),
          minutes: t(`${p}.minutes`),
          path: t(`${p}.path`),
          enrollCourse: t(`${p}.enrollCourse`),
          completeCourse: t(`${p}.completeCourse`),
          completed: t(`${p}.completed`),
          myProgress: t(`${p}.myProgress`),
          recommendations: t(`${p}.recommendations`),
          dismiss: t(`${p}.dismiss`),
          orgDashboard: t(`${p}.orgDashboard`),
          upcomingEvents: t(`${p}.upcomingEvents`),
          communityResources: t(`${p}.communityResources`),
          roleBasedLearning: t(`${p}.roleBasedLearning`),
          aiLearningAssistant: t(`${p}.aiLearningAssistant`),
          recentBriefings: t(`${p}.recentBriefings`),
          knowledgeCenter: t(`${p}.knowledgeCenter`),
          learningEngine: t(`${p}.learningEngine`),
          partners: t(`${p}.partners`),
        }}
      />
    </div>
  );
}
