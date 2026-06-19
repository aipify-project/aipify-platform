import { ServicePaymentsPanel } from "@/components/app/service-network";
import { buildServicePaymentsLabels } from "@/lib/service-network-engine/labels";
import type { ServicePaymentsSection } from "@/lib/service-network-engine/config";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function ServicePaymentsSectionPage({
  activeSection,
}: {
  activeSection: ServicePaymentsSection;
}) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "servicePayments");
  const t = createTranslator(dict);
  const labels = buildServicePaymentsLabels(t);

  return <ServicePaymentsPanel labels={labels} activeSection={activeSection} />;
}
