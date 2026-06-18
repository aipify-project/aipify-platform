import { OrganizationalAssetsPanel } from "@/components/app/app-portal/OrganizationalAssetsPanel";
import { buildOrganizationalAssetsLabels } from "@/lib/app-portal/organizational-assets";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalAssetsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <OrganizationalAssetsPanel labels={buildOrganizationalAssetsLabels(t)} />
    </div>
  );
}
