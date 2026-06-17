import { DesktopCompanionFoundationShell, DesktopSettingsPanel } from "@/components/app/desktop";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { getDesktopCompanionPageLabels } from "@/lib/desktop-companion-foundation/page-labels";

export default async function DesktopSettingsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp", "desktopCompanion"]);
  const t = createTranslator(dict);
  const labels = await getDesktopCompanionPageLabels();

  return (
    <DesktopCompanionFoundationShell labels={labels}>
      <DesktopSettingsPanel
        labels={{
          title: t("customerApp.desktop.settingsTitle"),
          subtitle: t("customerApp.desktop.settingsSubtitle"),
          loading: t("customerApp.desktop.loading"),
          back: t("customerApp.desktop.back"),
          enabled: t("customerApp.desktop.prefs.enabled"),
          includeBriefing: t("customerApp.desktop.prefs.includeBriefing"),
          includeGovernance: t("customerApp.desktop.prefs.includeGovernance"),
          includeQuality: t("customerApp.desktop.prefs.includeQuality"),
          includeSupport: t("customerApp.desktop.prefs.includeSupport"),
          includeKnowledge: t("customerApp.desktop.prefs.includeKnowledge"),
          includeIntegrations: t("customerApp.desktop.prefs.includeIntegrations"),
          includeSecurity: t("customerApp.desktop.prefs.includeSecurity"),
          maxPerDay: t("customerApp.desktop.prefs.maxPerDay"),
          privacy: t("customerApp.desktop.privacy"),
        }}
      />
    </DesktopCompanionFoundationShell>
  );
}
