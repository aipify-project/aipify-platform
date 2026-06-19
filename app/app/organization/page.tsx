import { OrganizationOperationsPanel } from "@/components/app/organization-operations";
import { buildOrganizationOperationsLabels } from "@/lib/organization-operations/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const labels = buildOrganizationOperationsLabels(createTranslator(dict));
  return <OrganizationOperationsPanel labels={labels} />;
}
