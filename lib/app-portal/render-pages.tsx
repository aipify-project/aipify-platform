import { Suspense } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  AppPortalFoundationPanel,
  AppPortalIntegrationSetupPanel,
  AppPortalIntegrationsHubPanel,
  AppPortalKnowledgePanel,
  AppPortalLicenseGate,
  AvailableBusinessPacksPanel,
  BusinessPackSettingsPanel,
} from "@/components/app/app-portal";
import SinceLastLoginSummaryPanel from "@/components/shared/since-last-login/SinceLastLoginSummaryPanel";
import { TeamCenterPanel } from "@/components/app/team/TeamCenterPanel";
import { buildAppPortalLabels, buildAppPortalFaqAnswerLabels } from "@/lib/app-portal/labels";
import { buildAppStoreLabels } from "@/lib/app-store/labels";
import { buildBusinessPackSettingsLabels } from "@/lib/app-portal/business-pack-settings";
import { buildBusinessPackDetailLabels } from "@/lib/app-portal/business-pack-detail-labels";
import {
  APP_PORTAL_INTEGRATIONS_FAQ_ARTICLES,
  buildAppPortalIntegrationsFaqAnswerLabels,
  buildAppPortalIntegrationsLabels,
} from "@/lib/app-portal/integrations";
import { APP_PORTAL_FAQ_ARTICLES } from "@/lib/app-portal/nav-config";
import { buildCustomerSinceLastLoginLabels } from "@/lib/since-last-login";
import { getCustomerAppDictionaryForSplits, getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export type AppPortalPageKey =
  | "notifications"
  | "rolesPermissions"
  | "activityOverview"
  | "installedBusinessPacks"
  | "availableBusinessPacks"
  | "businessPackSettings"
  | "tasks"
  | "workflows"
  | "insights"
  | "subscription"
  | "paymentHistory"
  | "invoices"
  | "upgradeOptions"
  | "contactSupport"
  | "supportHistory"
  | "profile"
  | "preferences"
  | "accountSecurity"
  | "accountNotifications"
  | "apiAccess";

const PAGE_KEYS: Record<AppPortalPageKey, { titleKey: string; subtitleKey: string; featureKey?: string }> = {
  notifications: {
    titleKey: "customerApp.portalStructure.pages.notifications.title",
    subtitleKey: "customerApp.portalStructure.pages.notifications.subtitle",
  },
  rolesPermissions: {
    titleKey: "customerApp.portalStructure.pages.rolesPermissions.title",
    subtitleKey: "customerApp.portalStructure.pages.rolesPermissions.subtitle",
    featureKey: "team_management",
  },
  activityOverview: {
    titleKey: "customerApp.portalStructure.pages.activityOverview.title",
    subtitleKey: "customerApp.portalStructure.pages.activityOverview.subtitle",
  },
  installedBusinessPacks: {
    titleKey: "customerApp.portalStructure.pages.installedBusinessPacks.title",
    subtitleKey: "customerApp.portalStructure.pages.installedBusinessPacks.subtitle",
    featureKey: "business_packs",
  },
  availableBusinessPacks: {
    titleKey: "customerApp.portalStructure.pages.availableBusinessPacks.title",
    subtitleKey: "customerApp.portalStructure.pages.availableBusinessPacks.subtitle",
  },
  businessPackSettings: {
    titleKey: "customerApp.portalStructure.pages.businessPackSettings.title",
    subtitleKey: "customerApp.portalStructure.pages.businessPackSettings.subtitle",
    featureKey: "business_packs",
  },
  tasks: {
    titleKey: "customerApp.portalStructure.pages.tasks.title",
    subtitleKey: "customerApp.portalStructure.pages.tasks.subtitle",
  },
  workflows: {
    titleKey: "customerApp.portalStructure.pages.workflows.title",
    subtitleKey: "customerApp.portalStructure.pages.workflows.subtitle",
    featureKey: "workflows",
  },
  insights: {
    titleKey: "customerApp.portalStructure.pages.insights.title",
    subtitleKey: "customerApp.portalStructure.pages.insights.subtitle",
    featureKey: "advanced_insights",
  },
  subscription: {
    titleKey: "customerApp.portalStructure.pages.subscription.title",
    subtitleKey: "customerApp.portalStructure.pages.subscription.subtitle",
    featureKey: "billing",
  },
  paymentHistory: {
    titleKey: "customerApp.portalStructure.pages.paymentHistory.title",
    subtitleKey: "customerApp.portalStructure.pages.paymentHistory.subtitle",
    featureKey: "billing",
  },
  invoices: {
    titleKey: "customerApp.portalStructure.pages.invoices.title",
    subtitleKey: "customerApp.portalStructure.pages.invoices.subtitle",
    featureKey: "billing",
  },
  upgradeOptions: {
    titleKey: "customerApp.portalStructure.pages.upgradeOptions.title",
    subtitleKey: "customerApp.portalStructure.pages.upgradeOptions.subtitle",
    featureKey: "billing",
  },
  contactSupport: {
    titleKey: "customerApp.portalStructure.pages.contactSupport.title",
    subtitleKey: "customerApp.portalStructure.pages.contactSupport.subtitle",
  },
  supportHistory: {
    titleKey: "customerApp.portalStructure.pages.supportHistory.title",
    subtitleKey: "customerApp.portalStructure.pages.supportHistory.subtitle",
  },
  profile: {
    titleKey: "customerApp.portalStructure.pages.profile.title",
    subtitleKey: "customerApp.portalStructure.pages.profile.subtitle",
  },
  preferences: {
    titleKey: "customerApp.portalStructure.pages.preferences.title",
    subtitleKey: "customerApp.portalStructure.pages.preferences.subtitle",
  },
  accountSecurity: {
    titleKey: "customerApp.portalStructure.pages.accountSecurity.title",
    subtitleKey: "customerApp.portalStructure.pages.accountSecurity.subtitle",
  },
  accountNotifications: {
    titleKey: "customerApp.portalStructure.pages.accountNotifications.title",
    subtitleKey: "customerApp.portalStructure.pages.accountNotifications.subtitle",
  },
  apiAccess: {
    titleKey: "customerApp.portalStructure.pages.apiAccess.title",
    subtitleKey: "customerApp.portalStructure.pages.apiAccess.subtitle",
    featureKey: "integrations",
  },
};

async function portalContext() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, [
    "portalStructure",
    "navigation",
    "dashboard",
  ]);
  const withBranding = {
    ...dict,
    ...(await getDictionary(locale, ["branding"])),
  };
  const t = createTranslator(withBranding);
  const labels = buildAppPortalLabels(t);
  return { locale, t, labels };
}

export async function renderAppPortalFoundationPage(pageKey: AppPortalPageKey) {
  const { t, labels } = await portalContext();
  const page = PAGE_KEYS[pageKey];
  const comingSoonPages: AppPortalPageKey[] = ["profile"];

  const panel = (
    <AppPortalFoundationPanel
      title={t(page.titleKey)}
      subtitle={t(page.subtitleKey)}
      structureNote={labels.foundation.structureNote}
      backLabel={labels.foundation.back}
      comingSoonLabel={
        comingSoonPages.includes(pageKey) ? labels.foundation.comingSoon : undefined
      }
    />
  );

  if (!page.featureKey) return panel;

  return (
    <AppPortalLicenseGate feature={page.featureKey} labels={labels.license}>
      {panel}
    </AppPortalLicenseGate>
  );
}

export async function renderAppPortalAvailableBusinessPacksPage() {
  const locale = await getLocale();
  const portalDict = await getCustomerAppDictionaryForSplits(locale, [
    "portalStructure",
    "navigation",
  ]);
  const marketplaceDict = await getCustomerAppDictionaryForSplits(locale, ["marketplace"]);
  const t = createTranslator({ ...portalDict, ...marketplaceDict });
  const portalLabels = buildAppPortalLabels(t);
  const storeLabels = buildAppStoreLabels(t);
  const detailLabels = buildBusinessPackDetailLabels(t);
  const page = PAGE_KEYS.availableBusinessPacks;
  const backLabel = t("customerApp.portalStructure.nav.availableBusinessPacks");

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {t(page.titleKey)}
        </h1>
        <p className="mt-2 text-slate-600">{t(page.subtitleKey)}</p>
      </div>
      <Suspense
        fallback={
          <div className="flex min-h-[320px] items-center justify-center">
            <AipifyLoader centered />
          </div>
        }
      >
        <AvailableBusinessPacksPanel
          labels={storeLabels}
          detailLabels={detailLabels}
          t={t}
          locale={locale}
          backLabel={backLabel}
          upgradeTitle={portalLabels.license.upgradeTitle}
          upgradeBody={portalLabels.license.upgradeBody}
          upgradeCta={portalLabels.license.upgradeCta}
        />
      </Suspense>
    </div>
  );
}

export async function renderAppPortalBusinessPackSettingsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure"]);
  const t = createTranslator(dict);
  const labels = buildBusinessPackSettingsLabels(t);

  return <BusinessPackSettingsPanel labels={labels} />;
}

export async function renderAppPortalSinceLastLoginPage() {
  const { t, labels } = await portalContext();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {labels.sinceLastLoginPage.title}
        </h1>
        <p className="mt-2 text-slate-600">{labels.sinceLastLoginPage.subtitle}</p>
      </div>
      <SinceLastLoginSummaryPanel
        scope="customer"
        labels={buildCustomerSinceLastLoginLabels(t)}
        variant="full"
      />
    </div>
  );
}

export async function renderAppPortalKnowledgePage() {
  const { t, labels } = await portalContext();
  const faqLabels = Object.fromEntries(
    APP_PORTAL_FAQ_ARTICLES.map((article) => [article.titleKey, t(article.titleKey)])
  );

  return (
    <AppPortalKnowledgePanel
      title={labels.knowledge.title}
      subtitle={labels.knowledge.subtitle}
      faqLabels={faqLabels}
      answerLabels={buildAppPortalFaqAnswerLabels(t)}
    />
  );
}

export async function renderAppPortalTeamPage() {
  const { locale, t } = await portalContext();

  return (
    <TeamCenterPanel
      locale={locale}
      labels={{
        title: t("customerApp.portalStructure.pages.teamMembers.title"),
        subtitle: t("customerApp.portalStructure.pages.teamMembers.subtitle"),
        loading: t("customerApp.team.loading"),
        empty: t("customerApp.team.empty"),
        pulseLabel: t("branding.pulseLabel"),
        members: t("customerApp.team.members"),
        invitations: t("customerApp.team.invitations"),
        noInvitations: t("customerApp.team.noInvitations"),
        columns: {
          name: t("customerApp.team.columns.name"),
          email: t("customerApp.team.columns.email"),
          role: t("customerApp.team.columns.role"),
          status: t("customerApp.team.columns.status"),
        },
        roleLabels: {
          owner: t("dashboard.roles.owner"),
          admin: t("dashboard.roles.admin"),
          support: t("dashboard.roles.support"),
          staff: t("dashboard.roles.staff"),
          read_only: t("dashboard.roles.read_only"),
          manager: t("dashboard.roles.admin"),
          viewer: t("dashboard.roles.read_only"),
        },
        inviteSoon: t("customerApp.team.inviteSoon"),
        achievementBadges: t("customerApp.team.achievementBadges"),
        noAchievementBadges: t("customerApp.team.noAchievementBadges"),
        viewCertifications: t("customerApp.team.viewCertifications"),
      }}
    />
  );
}

export async function renderAppPortalIntegrationsHubPage() {
  const { t, labels } = await portalContext();
  const integrationLabels = buildAppPortalIntegrationsLabels(t);
  const faqLabels = Object.fromEntries(
    APP_PORTAL_INTEGRATIONS_FAQ_ARTICLES.map((article) => [article.titleKey, t(article.titleKey)])
  );

  return (
    <AppPortalLicenseGate feature="integrations" labels={labels.license}>
      <AppPortalIntegrationsHubPanel
        labels={integrationLabels}
        faqLabels={faqLabels}
        answerLabels={buildAppPortalIntegrationsFaqAnswerLabels(t)}
      />
    </AppPortalLicenseGate>
  );
}

export async function renderAppPortalIntegrationSetupPage(providerKey: string) {
  const { t, labels } = await portalContext();
  const integrationLabels = buildAppPortalIntegrationsLabels(t);

  return (
    <AppPortalLicenseGate feature="integrations" labels={labels.license}>
      <AppPortalIntegrationSetupPanel
        providerKey={providerKey}
        labels={integrationLabels}
      />
    </AppPortalLicenseGate>
  );
}

export async function renderAppPortalIntegrationConnectPage() {
  return renderAppPortalIntegrationsHubPage();
}
