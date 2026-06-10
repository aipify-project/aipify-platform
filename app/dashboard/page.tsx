import Link from "next/link";
import CustomerOnboardingPanel from "@/components/dashboard/CustomerOnboardingPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DashboardPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["dashboard", "branding"]);
  const t = createTranslator(dict);

  const modules = [
    { href: "/dashboard/assistant", titleKey: "dashboard.nav.assistant", descKey: "dashboard.customerOverview.modules.assistant" },
    { href: "/dashboard/installs", titleKey: "dashboard.nav.install", descKey: "dashboard.customerOverview.modules.install" },
    { href: "/dashboard/support", titleKey: "dashboard.nav.support", descKey: "dashboard.customerOverview.modules.support" },
    { href: "/dashboard/analytics", titleKey: "dashboard.nav.analytics", descKey: "dashboard.customerOverview.modules.analytics" },
    { href: "/dashboard/commerce", titleKey: "dashboard.nav.commerce", descKey: "dashboard.customerOverview.modules.commerce" },
    { href: "/dashboard/notifications", titleKey: "dashboard.nav.notifications", descKey: "dashboard.customerOverview.modules.notifications" },
  ] as const;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {t("dashboard.customerOverview.title")}
        </h1>
        <p className="mt-2 max-w-2xl text-base text-gray-500 sm:text-lg">
          {t("dashboard.customerOverview.subtitle")}
        </p>
      </div>

      <CustomerOnboardingPanel
        labels={{
          title: t("dashboard.onboarding.title"),
          subtitle: t("dashboard.onboarding.subtitle"),
          loading: t("dashboard.onboarding.loading"),
          complete: t("dashboard.onboarding.complete"),
          pulseLabel: t("branding.pulseLabel"),
          items: {
            profile_completed: t("dashboard.onboarding.items.profile_completed"),
            domain_connected: t("dashboard.onboarding.items.domain_connected"),
            installation_active: t("dashboard.onboarding.items.installation_active"),
            health_scan_completed: t("dashboard.onboarding.items.health_scan_completed"),
            recommendation_generated: t("dashboard.onboarding.items.recommendation_generated"),
            support_enabled: t("dashboard.onboarding.items.support_enabled"),
          },
        }}
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <Link
            key={module.href}
            href={module.href}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-violet-200 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              {t(module.titleKey)}
            </h2>
            <p className="mt-2 text-sm text-gray-500">{t(module.descKey)}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-violet-100 bg-violet-50/60 p-6">
        <p className="text-sm font-medium text-violet-900">
          {t("dashboard.customerOverview.installFirstNote")}
        </p>
      </div>
    </div>
  );
}
