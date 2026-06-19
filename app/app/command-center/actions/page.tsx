import { CompanionCommandCenterPanel } from "@/components/app/companion-command-center";
import { buildCompanionCommandCenterLabels } from "@/lib/companion-command-center/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CompanionCommandCenterActionsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildCompanionCommandCenterLabels(t);
  return <CompanionCommandCenterPanel labels={labels} actionsOnly initialTab="actions" />;
}
