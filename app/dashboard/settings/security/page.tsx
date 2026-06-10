import { SettingsSubnav } from "@/components/app/settings/SettingsSubnav";
import { SecurityDashboardPanel } from "@/components/app/trust";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DashboardSettingsSecurityPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["settings", "branding"]);
  const t = createTranslator(dict);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <SettingsSubnav
        active="security"
        labels={{
          domains: t("settings.domains.title"),
          updates: t("settings.updates.nav"),
          security: t("settings.security.nav"),
        }}
      />
      <SecurityDashboardPanel
        locale={locale}
        labels={{
          title: t("settings.security.title"),
          subtitle: t("settings.security.subtitle"),
          loading: t("settings.security.loading"),
          connectedSystems: t("settings.security.connectedSystems"),
          noSystems: t("settings.security.noSystems"),
          permissionScopes: t("settings.security.permissionScopes"),
          registeredDomains: t("settings.security.registeredDomains"),
          noDomains: t("settings.security.noDomains"),
          recentActions: t("settings.security.recentActions"),
          noActions: t("settings.security.noActions"),
          tokenHealth: t("settings.security.tokenHealth"),
          principles: t("settings.security.principles"),
          dataOwnership: t("settings.security.dataOwnership"),
          areas: {
            systems: t("settings.security.areas.systems"),
            scopes: t("settings.security.areas.scopes"),
            actions: t("settings.security.areas.actions"),
            approvals: t("settings.security.areas.approvals"),
            ownership: t("settings.security.areas.ownership"),
            tokens: t("settings.security.areas.tokens"),
            recommendations: t("settings.security.areas.recommendations"),
          },
          pulseLabel: t("branding.pulseLabel"),
        }}
      />
    </div>
  );
}
