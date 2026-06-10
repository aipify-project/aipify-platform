import { DeveloperSettingsPanel } from "@/components/app/install-engine";
import { SettingsSubnav } from "@/components/app/settings/SettingsSubnav";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AppDeveloperSettingsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["install", "settings", "branding"]);
  const t = createTranslator(dict);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <SettingsSubnav
        active="developer"
        labels={{
          domains: t("settings.domains.title"),
          updates: t("settings.updates.nav"),
          security: t("settings.security.nav"),
          developer: t("install.modern.developer.nav"),
        }}
      />
      <DeveloperSettingsPanel
        labels={{
          title: t("install.modern.developer.title"),
          subtitle: t("install.modern.developer.subtitle"),
          loading: t("install.loading"),
          empty: t("install.modern.developer.empty"),
          pulseLabel: t("branding.pulseLabel"),
          advancedNotice: t("install.modern.developer.advancedNotice"),
          tokens: t("install.modern.developer.tokens"),
          tokensHint: t("install.modern.developer.tokensHint"),
          rotate: t("install.modern.developer.rotate"),
          rotating: t("install.modern.developer.rotating"),
          rotated: t("install.modern.developer.rotated"),
          rotateError: t("install.modern.developer.rotateError"),
          apiKeys: t("install.modern.developer.apiKeys"),
          apiKeysHint: t("install.modern.developer.apiKeysHint"),
          sdk: t("install.modern.developer.sdk"),
          sdkHint: t("install.modern.developer.sdkHint"),
          diagnostics: t("install.modern.developer.diagnostics"),
          diagnosticsHint: t("install.modern.developer.diagnosticsHint"),
          securityRules: t("install.modern.developer.securityRules"),
          installations: t("install.modern.developer.installations"),
          noInstallations: t("install.modern.developer.noInstallations"),
          tokenMasked: t("install.modern.developer.tokenMasked"),
        }}
      />
    </div>
  );
}
