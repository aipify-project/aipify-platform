import { ServiceCheckoutPanel } from "@/components/app/service-checkout";
import { buildServiceCheckoutLabels } from "@/lib/service-checkout-engine/labels";
import type { Pos612Section } from "@/lib/service-checkout-engine/config";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function ServiceCheckoutSectionPage({ activeSection }: { activeSection: Pos612Section }) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "serviceCheckout");
  const t = createTranslator(dict);
  return <ServiceCheckoutPanel labels={buildServiceCheckoutLabels(t)} activeSection={activeSection} />;
}
