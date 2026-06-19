import { ServiceIntakeDetailPanel } from "@/components/app/service-intake";
import { buildServiceIntakeLabels } from "@/lib/service-intake-engine/labels";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
export async function ServiceIntakeDetailPage({ entityType, entityKey }: { entityType: "form" | "submission"; entityKey: string }) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "serviceIntake");
  const t = createTranslator(dict);
  return <ServiceIntakeDetailPanel labels={buildServiceIntakeLabels(t)} entityType={entityType} entityKey={entityKey} />;
}
