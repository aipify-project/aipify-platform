import { BusinessPackRuntimeCustomerPanel } from "@/components/app/business-pack-runtime";
import { buildBusinessPackRuntimeCustomerLabels } from "@/lib/business-pack-runtime-engine/labels";
import type { Bpr603CustomerSection } from "@/lib/business-pack-runtime-engine/config";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function BusinessPackRuntimeCustomerSectionPage({ section }: { section: Bpr603CustomerSection }) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildBusinessPackRuntimeCustomerLabels(t);

  return <BusinessPackRuntimeCustomerPanel labels={labels} section={section} />;
}
