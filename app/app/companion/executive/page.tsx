import { CompanionExecutiveLayerDashboardPanel } from "@/components/app/companion-executive-layer";
import type { CompanionExecutiveLayerLabels } from "@/lib/aipify/companion-executive-layer";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator, type Translator } from "@/lib/i18n/translate";

function buildLabels(t: Translator): CompanionExecutiveLayerLabels {
  const p = "customerApp.companionExecutiveLayer";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    principle: t(`${p}.principle`),
    privacyNote: t(`${p}.privacyNote`),
    goldenRule: t(`${p}.goldenRule`),
    emptyTitle: t(`${p}.emptyTitle`),
    emptyBody: t(`${p}.emptyBody`),
    emptyCta: t(`${p}.emptyCta`),
    accessDenied: t(`${p}.accessDenied`),
    filters: {
      search: t(`${p}.filters.search`),
      workspace: t(`${p}.filters.workspace`),
      all: t(`${p}.filters.all`),
    },
    sections: {
      home: t(`${p}.sections.home`),
      dailyOpening: t(`${p}.sections.dailyOpening`),
      todaysPriorities: t(`${p}.sections.todaysPriorities`),
      sinceLastLogin: t(`${p}.sections.sinceLastLogin`),
      recommendedActions: t(`${p}.sections.recommendedActions`),
      upcomingMeetings: t(`${p}.sections.upcomingMeetings`),
      executiveBriefing: t(`${p}.sections.executiveBriefing`),
      strategicFocus: t(`${p}.sections.strategicFocus`),
      actionCenter: t(`${p}.sections.actionCenter`),
      focusEngine: t(`${p}.sections.focusEngine`),
      relationships: t(`${p}.sections.relationships`),
      intelligence: t(`${p}.sections.intelligence`),
      decisionSupport: t(`${p}.sections.decisionSupport`),
      timeline: t(`${p}.sections.timeline`),
      usageExamples: t(`${p}.sections.usageExamples`),
    },
    dashboard: {
      executiveHealthScore: t(`${p}.dashboard.executiveHealthScore`),
      organizationalHealthScore: t(`${p}.dashboard.organizationalHealthScore`),
      executiveReadinessScore: t(`${p}.dashboard.executiveReadinessScore`),
      todaysPriorities: t(`${p}.dashboard.todaysPriorities`),
      strategicOpportunities: t(`${p}.dashboard.strategicOpportunities`),
      emergingRisks: t(`${p}.dashboard.emergingRisks`),
      relationshipInsights: t(`${p}.dashboard.relationshipInsights`),
      executiveSummary: t(`${p}.dashboard.executiveSummary`),
    },
    card: {
      observation: t(`${p}.card.observation`),
      explanation: t(`${p}.card.explanation`),
      impact: t(`${p}.card.impact`),
      recommendation: t(`${p}.card.recommendation`),
      effort: t(`${p}.card.effort`),
      potentialValue: t(`${p}.card.potentialValue`),
      dueDate: t(`${p}.card.dueDate`),
      priority: t(`${p}.card.priority`),
    },
    actions: {
      generateBriefing: t(`${p}.actions.generateBriefing`),
      viewDetails: t(`${p}.actions.viewDetails`),
    },
    workspaces: {
      personal: t(`${p}.workspaces.personal`),
      organization: t(`${p}.workspaces.organization`),
      strategic: t(`${p}.workspaces.strategic`),
      growth: t(`${p}.workspaces.growth`),
      future: t(`${p}.workspaces.future`),
    },
    focusAreas: {
      strategic: t(`${p}.focusAreas.strategic`),
      operational: t(`${p}.focusAreas.operational`),
      growth: t(`${p}.focusAreas.growth`),
      workforce: t(`${p}.focusAreas.workforce`),
      customer: t(`${p}.focusAreas.customer`),
    },
    briefingPeriods: {
      today: t(`${p}.briefingPeriods.today`),
      this_week: t(`${p}.briefingPeriods.thisWeek`),
      this_month: t(`${p}.briefingPeriods.thisMonth`),
      this_quarter: t(`${p}.briefingPeriods.thisQuarter`),
    },
    faq: {
      title: t(`${p}.faq.title`),
      whatIs: t(`${p}.faq.whatIs`),
      whatIsAnswer: t(`${p}.faq.whatIsAnswer`),
      makesDecisions: t(`${p}.faq.makesDecisions`),
      makesDecisionsAnswer: t(`${p}.faq.makesDecisionsAnswer`),
      whyUse: t(`${p}.faq.whyUse`),
      whyUseAnswer: t(`${p}.faq.whyUseAnswer`),
    },
  };
}

export default async function CompanionExecutivePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const labels = buildLabels(t);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>
      <CompanionExecutiveLayerDashboardPanel labels={labels} />
    </div>
  );
}
