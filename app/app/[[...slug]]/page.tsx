import { redirect } from "next/navigation";
import { CustomerHomePanel } from "@/components/app/home/CustomerHomePanel";
import { APP_ROUTE_ALIASES } from "@/lib/app/route-aliases";
import type { HealthScoreBand } from "@/lib/app/customer-app";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type AppPageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function AppCatchAllPage({ params }: AppPageProps) {
  const { slug } = await params;

  if (!slug?.length) {
    const locale = await getLocale();
    const dict = await getDictionary(locale, ["customerApp", "branding"]);
    const t = createTranslator(dict);

    const healthBands = {
      excellent: t("customerApp.home.healthBands.excellent"),
      healthy: t("customerApp.home.healthBands.healthy"),
      needs_attention: t("customerApp.home.healthBands.needs_attention"),
      action_recommended: t("customerApp.home.healthBands.action_recommended"),
    } as Record<HealthScoreBand, string>;

    return (
      <CustomerHomePanel
        locale={locale}
        labels={{
          loading: t("customerApp.home.loading"),
          empty: t("customerApp.home.empty"),
          pulseLabel: t("branding.pulseLabel"),
          principle: t("customerApp.principle"),
          healthTitle: t("customerApp.home.healthTitle"),
          healthBands,
          sections: {
            activity: t("customerApp.home.sections.activity"),
            recommendations: t("customerApp.home.sections.recommendations"),
            approvals: t("customerApp.home.sections.approvals"),
            quickActions: t("customerApp.home.sections.quickActions"),
          },
          noActivity: t("customerApp.home.noActivity"),
          noRecommendations: t("customerApp.home.noRecommendations"),
          approvalsPending: t("customerApp.home.approvalsPending"),
          viewAll: t("customerApp.home.viewAll"),
        onboardingNote: t("customerApp.home.onboardingNote"),
        overviewLate: t("customerApp.home.overviewLate"),
        briefing: {
          sinceLastLogin: t("customerApp.briefing.sinceLastLogin"),
          viewFull: t("customerApp.briefing.viewFull"),
          recommendedStep: t("customerApp.briefing.recommendedStep"),
          openApprovals: t("customerApp.briefing.openApprovals"),
          openQuality: t("customerApp.briefing.openQuality"),
          markRead: t("customerApp.briefing.markRead"),
        },
        desktop: {
          title: t("customerApp.desktop.title"),
          open: t("customerApp.desktop.open"),
          mode: t("customerApp.desktop.mode"),
          unread: t("customerApp.desktop.unread"),
          remindersSoon: t("customerApp.desktop.remindersSoon"),
        },
        memoryEngine: {
          title: t("customerApp.memoryEngine.title"),
          open: t("customerApp.memoryEngine.open"),
          profiles: t("customerApp.memoryEngine.profiles"),
          patterns: t("customerApp.memoryEngine.patternsLabel"),
        },
        skillStore: {
          title: t("customerApp.skillStore.title"),
          open: t("customerApp.skillStore.open"),
          installed: t("customerApp.skillStore.installed"),
          available: t("customerApp.skillStore.available"),
        },
        actionHub: {
          title: t("customerApp.actionHub.title"),
          open: t("customerApp.actionHub.openCount"),
          critical: t("customerApp.actionHub.critical"),
          openHub: t("customerApp.actionHub.openHub"),
        },
        learningEngine: {
          title: t("customerApp.learningEngine.title"),
          open: t("customerApp.learningEngine.open"),
          events: t("customerApp.learningEngine.events"),
          positive: t("customerApp.learningEngine.positive"),
        },
        assistantIdentity: {
          prompt: t("customerApp.assistantIdentity.banner.prompt"),
          subtitle: t("customerApp.assistantIdentity.banner.subtitle"),
          cta: t("customerApp.assistantIdentity.banner.cta"),
        },
        enterpriseDeployment: {
          title: t("customerApp.enterpriseDeployment.title"),
          open: t("customerApp.enterpriseDeployment.open"),
          cloudSaas: t("customerApp.enterpriseDeployment.deploymentModes.cloud_saas"),
          agentsOnline: t("customerApp.enterpriseDeployment.agentsOnline"),
          jobsQueued: t("customerApp.enterpriseDeployment.jobsQueued"),
        },
        greetings: {
          morning: t("customerApp.greetings.morning"),
          afternoon: t("customerApp.greetings.afternoon"),
          evening: t("customerApp.greetings.evening"),
          late: [
            t("customerApp.greetings.late.workingLate"),
            t("customerApp.greetings.late.onDuty"),
            t("customerApp.greetings.late.stable"),
          ],
        },
      }}
      />
    );
  }

  const canonical = `/app/${slug.join("/")}`;
  const target = APP_ROUTE_ALIASES[canonical];
  if (target) redirect(target);
  redirect("/app");
}
