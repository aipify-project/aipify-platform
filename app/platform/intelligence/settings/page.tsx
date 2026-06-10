import PlatformIntelligenceSettingsPanel from "@/components/platform/PlatformIntelligenceSettingsPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function IntelligenceSettingsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <PlatformIntelligenceSettingsPanel
      labels={{
        title: t("platform.intelligence.settings.title"),
        subtitle: t("platform.intelligence.settings.subtitle"),
        levels: {
          title: t("platform.intelligence.settings.levels.title"),
          internal: {
            title: t("platform.intelligence.settings.levels.internal.title"),
            description: t("platform.intelligence.settings.levels.internal.description"),
          },
          pilot: {
            title: t("platform.intelligence.settings.levels.pilot.title"),
            description: t("platform.intelligence.settings.levels.pilot.description"),
          },
          customer: {
            title: t("platform.intelligence.settings.levels.customer.title"),
            description: t("platform.intelligence.settings.levels.customer.description"),
          },
          global: {
            title: t("platform.intelligence.settings.levels.global.title"),
            description: t("platform.intelligence.settings.levels.global.description"),
          },
        },
        privacy: {
          title: t("platform.intelligence.settings.privacy.title"),
          neverLearn: t("platform.intelligence.settings.privacy.neverLearn"),
          onlyLearn: t("platform.intelligence.settings.privacy.onlyLearn"),
          neverItems: [
            t("platform.intelligence.settings.privacy.neverItems.conversations"),
            t("platform.intelligence.settings.privacy.neverItems.names"),
            t("platform.intelligence.settings.privacy.neverItems.emails"),
            t("platform.intelligence.settings.privacy.neverItems.invoices"),
            t("platform.intelligence.settings.privacy.neverItems.files"),
            t("platform.intelligence.settings.privacy.neverItems.payments"),
            t("platform.intelligence.settings.privacy.neverItems.documents"),
          ],
          onlyItems: [
            t("platform.intelligence.settings.privacy.onlyItems.behaviour"),
            t("platform.intelligence.settings.privacy.onlyItems.performance"),
            t("platform.intelligence.settings.privacy.onlyItems.automation"),
            t("platform.intelligence.settings.privacy.onlyItems.errors"),
            t("platform.intelligence.settings.privacy.onlyItems.supportCategories"),
            t("platform.intelligence.settings.privacy.onlyItems.installationEvents"),
          ],
        },
        tenantIsolation: {
          title: t("platform.intelligence.settings.tenantIsolation.title"),
          description: t("platform.intelligence.settings.tenantIsolation.description"),
        },
        publicTrust: {
          title: t("platform.intelligence.settings.publicTrust.title"),
          description: t("platform.intelligence.settings.publicTrust.description"),
        },
      }}
    />
  );
}
