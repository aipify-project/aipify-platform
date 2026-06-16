import { EarlyWarningCenterPanel } from "@/components/app/executive/EarlyWarningCenterPanel";
import { buildOrganizationalEarlyWarningLabels } from "@/lib/organizational-early-warning";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function EarlyWarningCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  return <EarlyWarningCenterPanel labels={buildOrganizationalEarlyWarningLabels(t)} />;
}
