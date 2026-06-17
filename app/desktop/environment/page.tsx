import { CompanionDeviceEnvironmentPanel } from "@/components/app/desktop/CompanionDeviceEnvironmentPanel";
import { buildCompanionDeviceEnvironmentLabels } from "@/lib/companion-device-environment/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DesktopEnvironmentPage() {
  const dict = await getDictionary(await getLocale(), ["companionDeviceEnvironment"]);
  const t = createTranslator(dict);
  return (
    <CompanionDeviceEnvironmentPanel labels={buildCompanionDeviceEnvironmentLabels(t)} />
  );
}
