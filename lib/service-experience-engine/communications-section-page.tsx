import { ServiceCommunicationsPanel } from "@/components/app/service-experience/ServiceCommunicationsPanel";
import { buildServiceCommunicationsLabels } from "@/lib/service-experience-engine/labels";
import type { ServiceCommunicationsSection } from "@/lib/service-experience-engine/communications-config";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function ServiceCommunicationsSectionPage({
  activeSection,
}: {
  activeSection: ServiceCommunicationsSection;
}) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "serviceCommunications");
  const t = createTranslator(dict);
  return (
    <ServiceCommunicationsPanel
      labels={buildServiceCommunicationsLabels(t)}
      activeSection={activeSection}
    />
  );
}
