import { PlatformInstallEngineScaffold } from "@/components/platform/install-engine";
import {
  DETECTED_SYSTEMS,
  INSTALL_ROLLOUT_STAGES,
  INSTALL_WORKFLOW_STEPS,
} from "@/lib/install";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformInstallEnginePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <PlatformInstallEngineScaffold
      title={t("platform.installEngine.title")}
      subtitle={t("platform.installEngine.subtitle")}
      statsLabel={t("platform.installEngine.statsLabel")}
      statsValue={t("platform.installEngine.statsValue")
        .replace("{steps}", String(INSTALL_WORKFLOW_STEPS.length))
        .replace("{systems}", String(DETECTED_SYSTEMS.length))
        .replace("{stages}", String(INSTALL_ROLLOUT_STAGES.length))}
      areas={[
        t("platform.installEngine.areas.integrations"),
        t("platform.installEngine.areas.templates"),
        t("platform.installEngine.areas.metrics"),
        t("platform.installEngine.areas.heartbeats"),
        t("platform.installEngine.areas.rollout"),
      ]}
    />
  );
}
