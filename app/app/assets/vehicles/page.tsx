import { AssetManagementPanel } from "@/components/app/asset-management";
import { buildAssetManagementLabels } from "@/lib/asset-management/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function VehiclesPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildAssetManagementLabels(t);
  return (
    <AssetManagementPanel
      labels={labels}
      initialAssetType="vehicle"
      initialTab="vehicles"
      titleOverride={labels.vehiclesTitle}
    />
  );
}
