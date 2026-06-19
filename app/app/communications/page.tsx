import { CommunicationManagementPanel } from "@/components/app/communication-management";
import { buildCommunicationManagementLabels } from "@/lib/communication-management/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CommunicationsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildCommunicationManagementLabels(t);
  return <CommunicationManagementPanel labels={labels} />;
}
