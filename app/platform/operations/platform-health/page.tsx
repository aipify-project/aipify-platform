import { PlatformHealthOperationsCenterPanel } from "@/components/platform/platform-health-operations-center";
import { buildPlatformHealthOperationsLabels } from "@/lib/platform-health-operations-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { PlatformDriftHubShell } from "@/components/platform/drift/PlatformDriftHubShell";
import { DRIFT_OPERATIONS_HUB_ID } from "@/lib/platform/drift-hub";

export default async function PlatformHealthOperationsCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <PlatformDriftHubShell hub={DRIFT_OPERATIONS_HUB_ID}>
          <PlatformHealthOperationsCenterPanel
            backHref="/platform"
            labels={buildPlatformHealthOperationsLabels(t)}
          />
    </PlatformDriftHubShell>
  );
}
