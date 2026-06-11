import { GovernanceSettingsPanel } from "@/components/app/settings/GovernanceSettingsPanel";
import { GOVERNANCE_MODES } from "@/lib/aipify/governance";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function GovernanceSettingsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  const modes = Object.fromEntries(
    GOVERNANCE_MODES.map((mode) => [mode, t(`customerApp.governance.modes.${mode}`)])
  );

  return (
    <GovernanceSettingsPanel
      labels={{
        title: t("customerApp.settings.governance.title"),
        description: t("customerApp.settings.governance.description"),
        privacy: t("customerApp.settings.governance.privacy"),
        loading: t("customerApp.settings.governance.loading"),
        back: t("customerApp.settings.governance.back"),
        save: t("customerApp.settings.governance.save"),
        saved: t("customerApp.settings.governance.saved"),
        upgradeTitle: t("customerApp.settings.governance.upgrade.title"),
        upgradeBody: t("customerApp.settings.governance.upgrade.body"),
        upgradeCta: t("customerApp.settings.governance.upgrade.cta"),
        centerLink: t("customerApp.settings.governance.centerLink"),
        modes,
        fields: {
          mode: t("customerApp.settings.governance.fields.mode"),
          emergency: t("customerApp.settings.governance.fields.emergency"),
          explainability: t("customerApp.settings.governance.fields.explainability"),
          trustScoring: t("customerApp.settings.governance.fields.trustScoring"),
          retention: t("customerApp.settings.governance.fields.retention"),
        },
      }}
    />
  );
}
