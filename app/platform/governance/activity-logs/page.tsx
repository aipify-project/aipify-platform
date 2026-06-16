import { PlatformPortalFoundationPanel } from "@/components/platform/platform-portal";
import { buildPlatformPortalLabels } from "@/lib/platform-portal";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformActivityLogsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const labels = buildPlatformPortalLabels(t);

  return (
    <PlatformPortalFoundationPanel
      title={t("platform.portalStructure.activityLogs.title")}
      subtitle={t("platform.portalStructure.activityLogs.subtitle")}
      structureNote={labels.foundation.structureNote}
      backLabel={labels.foundation.back}
    />
  );
}
