import PlatformOverviewPanel from "@/components/platform/PlatformOverviewPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

function countTemplate(template: string, count: number) {
  return template.replace("{count}", String(count));
}

export default async function PlatformOverviewPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform", "branding"]);
  const t = createTranslator(dict);

  const trialsExpiringTpl = {
    title: t("platform.overview.recommendedActions.trialsExpiring.title"),
    reason: t("platform.overview.recommendedActions.trialsExpiring.reason"),
    action: t("platform.overview.recommendedActions.trialsExpiring.action"),
  };
  const failedAutomationTpl = {
    title: t("platform.overview.recommendedActions.failedAutomation.title"),
    reason: t("platform.overview.recommendedActions.failedAutomation.reason"),
    action: t("platform.overview.recommendedActions.failedAutomation.action"),
  };

  return (
    <PlatformOverviewPanel
      labels={{
        title: t("platform.overview.title"),
        subtitle: t("platform.overview.subtitle"),
        note: t("platform.overview.note"),
        loading: t("platform.overview.loading"),
        pulseLabel: t("branding.pulseLabel"),
        priorityLabels: {
          critical: t("platform.overview.priorityLabels.critical"),
          important: t("platform.overview.priorityLabels.important"),
          informational: t("platform.overview.priorityLabels.informational"),
        },
        briefing: {
          title: t("platform.overview.briefing.title"),
          greetingMorning: t("platform.overview.briefing.greetingMorning"),
          greetingAfternoon: t("platform.overview.briefing.greetingAfternoon"),
          greetingEvening: t("platform.overview.briefing.greetingEvening"),
          sinceVisit: t("platform.overview.briefing.sinceVisit"),
          newCustomers: (count) =>
            countTemplate(t("platform.overview.briefing.newCustomers"), count),
          trialsEnding: (count) =>
            countTemplate(t("platform.overview.briefing.trialsEnding"), count),
          supportResolved: (count) =>
            countTemplate(t("platform.overview.briefing.supportResolved"), count),
          escalated: (count) =>
            countTemplate(t("platform.overview.briefing.escalated"), count),
          failedAutomations: (count) =>
            countTemplate(t("platform.overview.briefing.failedAutomations"), count),
          systemWarnings: (count) =>
            countTemplate(t("platform.overview.briefing.systemWarnings"), count),
          newRecommendations: (count) =>
            countTemplate(t("platform.overview.briefing.newRecommendations"), count),
          followUp: (count) =>
            countTemplate(t("platform.overview.briefing.followUp"), count),
          noIncidents: t("platform.overview.briefing.noIncidents"),
          incidents: (count) =>
            countTemplate(t("platform.overview.briefing.incidents"), count),
        },
        recommendedActions: {
          title: t("platform.overview.recommendedActions.title"),
          suggestedAction: t("platform.overview.recommendedActions.suggestedAction"),
          empty: t("platform.overview.recommendedActions.empty"),
          trialsExpiring: (count) => ({
            title: countTemplate(trialsExpiringTpl.title, count),
            reason: trialsExpiringTpl.reason,
            action: trialsExpiringTpl.action,
          }),
          healthDropped: {
            title: t("platform.overview.recommendedActions.healthDropped.title"),
            reason: t("platform.overview.recommendedActions.healthDropped.reason"),
            action: t("platform.overview.recommendedActions.healthDropped.action"),
          },
          escalationWaiting: {
            title: t("platform.overview.recommendedActions.escalationWaiting.title"),
            reason: t("platform.overview.recommendedActions.escalationWaiting.reason"),
            action: t("platform.overview.recommendedActions.escalationWaiting.action"),
          },
          revenueOpportunity: {
            title: t("platform.overview.recommendedActions.revenueOpportunity.title"),
            reason: t("platform.overview.recommendedActions.revenueOpportunity.reason"),
            action: t("platform.overview.recommendedActions.revenueOpportunity.action"),
          },
          failedAutomation: (count) => ({
            title: countTemplate(failedAutomationTpl.title, count),
            reason: failedAutomationTpl.reason,
            action: failedAutomationTpl.action,
          }),
        },
        sinceLogin: {
          title: t("platform.overview.sinceLogin.title"),
          markRead: t("platform.overview.sinceLogin.markRead"),
          markedRead: t("platform.overview.sinceLogin.markedRead"),
          expand: t("platform.overview.sinceLogin.expand"),
          openModule: t("platform.overview.sinceLogin.openModule"),
          newCustomers: (count) =>
            countTemplate(t("platform.overview.sinceLogin.newCustomers"), count),
          supportResolved: (count) =>
            countTemplate(t("platform.overview.sinceLogin.supportResolved"), count),
          escalated: (count) =>
            countTemplate(t("platform.overview.sinceLogin.escalated"), count),
          installationsCompleted: (count) =>
            countTemplate(t("platform.overview.sinceLogin.installationsCompleted"), count),
          automationsTriggered: (count) =>
            countTemplate(t("platform.overview.sinceLogin.automationsTriggered"), count),
          aiRecommendations: (count) =>
            countTemplate(t("platform.overview.sinceLogin.aiRecommendations"), count),
          systemIncidents: (count) =>
            countTemplate(t("platform.overview.sinceLogin.systemIncidents"), count),
          revenueEvents: (count) =>
            countTemplate(t("platform.overview.sinceLogin.revenueEvents"), count),
          recommendationHint: t("platform.overview.sinceLogin.recommendationHint"),
          empty: t("platform.overview.sinceLogin.empty"),
        },
        learning: {
          title: t("platform.overview.learning.title"),
          subtitle: t("platform.overview.learning.subtitle"),
          loading: t("platform.overview.learning.loading"),
          pulseLabel: t("branding.pulseLabel"),
          totals: {
            patterns: t("platform.overview.learning.totals.patterns"),
            approvedPatterns: t("platform.overview.learning.totals.approvedPatterns"),
            learningEvents: t("platform.overview.learning.totals.learningEvents"),
            healingExecutions: t("platform.overview.learning.totals.healingExecutions"),
          },
          patterns: {
            title: t("platform.overview.learning.patterns.title"),
            empty: t("platform.overview.learning.patterns.empty"),
            approved: t("platform.overview.learning.patterns.approved"),
          },
          environments: {
            title: t("platform.overview.learning.environments.title"),
            internal: t("platform.overview.learning.environments.internal"),
            pilot: t("platform.overview.learning.environments.pilot"),
            customer: t("platform.overview.learning.environments.customer"),
            enterprise: t("platform.overview.learning.environments.enterprise"),
          },
          privacyNote: t("platform.overview.learning.privacyNote"),
        },
      }}
    />
  );
}
