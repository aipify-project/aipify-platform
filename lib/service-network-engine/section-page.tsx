import { ServiceNetworkPanel } from "@/components/app/service-network";
import { buildServiceNetworkLabels } from "@/lib/service-network-engine/labels";
import type { ServiceNetworkSection } from "@/lib/service-network-engine/config";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function ServiceNetworkSectionPage({
  activeSection,
}: {
  activeSection: ServiceNetworkSection;
}) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "serviceNetwork");
  const t = createTranslator(dict);
  const labels = buildServiceNetworkLabels(t);

  return <ServiceNetworkPanel labels={labels} activeSection={activeSection} />;
}
