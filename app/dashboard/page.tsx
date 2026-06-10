import AssistantPanel from "@/components/dashboard/AssistantPanel";
import ActionList from "@/components/dashboard/ActionList";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { getNavIcon } from "@/components/dashboard/nav-icons";
import StatCard from "@/components/dashboard/StatCard";
import SystemStatus from "@/components/dashboard/SystemStatus";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

const NAV_IDS = [
  "overview",
  "assistant",
  "install",
  "support",
  "analytics",
  "commerce",
  "notifications",
  "team",
  "settings",
] as const;

export default async function DashboardPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["common", "dashboard"]);
  const t = createTranslator(dict);

  const navItems = NAV_IDS.map((id) => ({
    id,
    label: t(`dashboard.nav.${id}`),
    icon: getNavIcon(id),
  }));

  const operational = t("dashboard.systemStatus.operational");

  return (
    <DashboardShell
      appName={t("common.appName")}
      planName={t("dashboard.sidebar.plan")}
      searchPlaceholder={t("dashboard.search")}
      companySelectorLabel={t("dashboard.topbar.companySelector")}
      notificationsLabel={t("dashboard.topbar.notifications")}
      profileFallbackName={t("dashboard.topbar.profileFallback")}
      companyFallbackName={t("dashboard.topbar.companyFallback")}
      roleLabels={{
        owner: t("dashboard.roles.owner"),
        admin: t("dashboard.roles.admin"),
        support: t("dashboard.roles.support"),
        staff: t("dashboard.roles.staff"),
      }}
      navItems={navItems}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {t("dashboard.greeting")}
          </h1>
          <p className="mt-2 text-base text-gray-500 sm:text-lg">
            {t("dashboard.subtitle")}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label={t("dashboard.stats.supportHandled")}
            value="24"
            change={t("dashboard.stats.supportHandledChange")}
            changeTone="positive"
            accent="blue"
            className="animate-fade-in-up-delay-1"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
            }
          />
          <StatCard
            label={t("dashboard.stats.tasksPending")}
            value="7"
            change={t("dashboard.stats.tasksPendingChange")}
            changeTone="warning"
            accent="violet"
            className="animate-fade-in-up-delay-1"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.9.693 2.166 1.638m-5.8 0A2.251 2.251 0 007.5 2.25H6.108c-1.135 0-2.098.845-2.192 1.976a48.424 48.424 0 00-.08 1.123" />
              </svg>
            }
          />
          <StatCard
            label={t("dashboard.stats.recommendations")}
            value="5"
            change={t("dashboard.stats.recommendationsChange")}
            changeTone="positive"
            accent="indigo"
            className="animate-fade-in-up-delay-2"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m4.5 0a12.05 12.05 0 003.478-.897m-9 0a12.05 12.05 0 00-3.478-.897M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
          <StatCard
            label={t("dashboard.stats.systemHealth")}
            value="98%"
            change={t("dashboard.stats.systemHealthChange")}
            changeTone="neutral"
            accent="green"
            className="animate-fade-in-up-delay-3"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="animate-fade-in-up-delay-2">
            <AssistantPanel
              title={t("dashboard.assistant.title")}
              greeting={t("dashboard.assistant.greeting")}
              subtitle={t("dashboard.assistant.subtitle")}
              online={t("dashboard.assistant.online")}
              sinceLogin={t("dashboard.assistant.sinceLogin")}
              items={[
                t("dashboard.assistant.items.tickets"),
                t("dashboard.assistant.items.recommendations"),
                t("dashboard.assistant.items.integration"),
              ]}
              refresh={t("dashboard.assistant.refresh")}
              askAipify={t("dashboard.assistant.askAipify")}
            />
          </div>
          <div className="animate-fade-in-up-delay-3">
            <ActionList
              title={t("dashboard.actions.title")}
              items={[
                t("dashboard.actions.items.reviewTickets"),
                t("dashboard.actions.items.checkIntegration"),
                t("dashboard.actions.items.prepareSummary"),
              ]}
            />
          </div>
        </div>

        <div className="mt-6 animate-fade-in-up-delay-3">
          <SystemStatus
            title={t("dashboard.systemStatus.title")}
            services={[
              {
                name: t("dashboard.systemStatus.services.api"),
                status: operational,
              },
              {
                name: t("dashboard.systemStatus.services.email"),
                status: operational,
              },
              {
                name: t("dashboard.systemStatus.services.aiAssistant"),
                status: operational,
              },
              {
                name: t("dashboard.systemStatus.services.database"),
                status: operational,
              },
            ]}
          />
        </div>
      </div>
    </DashboardShell>
  );
}
