import DashboardShell from "@/components/dashboard/DashboardShell";
import PlatformAuthGuard from "@/components/platform/PlatformAuthGuard";
import PlatformAccessGate from "@/components/platform/PlatformAccessGate";
import PlatformPortalBanner from "@/components/platform/PlatformPortalBanner";
import { PlatformProfileProvider } from "@/components/platform/PlatformProfileProvider";
import {
  PLATFORM_ADMIN_NAV,
  PLATFORM_MOBILE_NAV_IDS,
} from "@/lib/platform/nav-config";
import { buildCommandBarLabels, platformNavSources } from "@/lib/command-bar";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { buildPresenceLabels } from "@/lib/presence/labels";

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["common", "auth", "platform", "branding", "presence", "commandBar"]);
  const t = createTranslator(dict);

  return (
    <PlatformAuthGuard
      loadingLabel={t("common.loading")}
      deniedLabel={t("platform.accessDenied")}
    >
      <PlatformAccessGate
        loadingLabel={t("common.loading")}
        twoFactorRequiredLabel={t("platform.portal.twoFactorRequired")}
      >
      <PlatformProfileProvider>
        <DashboardShell
          appName={t("common.appName")}
          planName={t("platform.sidebar.plan")}
          shellLabel=""
          searchPlaceholder={t("platform.search")}
          companySelectorLabel={t("platform.topbar.organization")}
          notificationsLabel={t("platform.topbar.notifications")}
          profileFallbackName={t("platform.topbar.profileFallback")}
          companyFallbackName={t("platform.topbar.organizationFallback")}
          signOutLabel={t("auth.logout.signOut")}
          companyNameOverride={t("platform.sidebar.organization")}
          roleLabels={{
            super_admin: t("platform.roles.super_admin"),
            platform_support: t("platform.roles.platform_support"),
          }}
          navConfig={PLATFORM_ADMIN_NAV.map((item) => ({
            id: item.id,
            href: item.href,
            label: t(item.labelKey),
          }))}
          shellVariant="platform"
          mobileNavIds={PLATFORM_MOBILE_NAV_IDS}
          platformBrandMark={{
            poweredBy: t("branding.poweredBy"),
            tooltipTitle: t("branding.platformTooltipTitle"),
            tooltipTagline: t("branding.platformTooltipTagline"),
            versionLabel: t("branding.platformVersion"),
            pulseLabel: t("branding.pulseLabel"),
          }}
          presenceLabels={buildPresenceLabels(t)}
          locale={locale}
          commandBar={{
            portal: "platform",
            labels: buildCommandBarLabels(t),
            navSources: platformNavSources(t),
          }}
        >
          <PlatformPortalBanner
            title={t("platform.portal.bannerTitle")}
            body={t("platform.portal.bannerBody")}
          />
          {children}
        </DashboardShell>
      </PlatformProfileProvider>
      </PlatformAccessGate>
    </PlatformAuthGuard>
  );
}
