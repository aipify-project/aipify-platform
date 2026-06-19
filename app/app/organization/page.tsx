import { OrganizationManagementPanel } from "@/components/app/organization-management";
import { buildOrganizationManagementLabels } from "@/lib/organization-management/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildOrganizationManagementLabels(t);

  return <OrganizationManagementPanel labels={labels} />;
}
