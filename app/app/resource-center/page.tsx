import { ResourceCapacityPanel } from "@/components/app/resource-capacity-operations";
import { buildResourceCapacityLabels } from "@/lib/customer-resource-capacity-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ResourceCenterPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "resourceCapacityOperations");
  const labels = buildResourceCapacityLabels(createTranslator(dict));
  return <ResourceCapacityPanel backHref="/app" labels={labels} />;
}
