import { EventCenterPanel } from "@/components/app/event-center";
import { buildEventCenterLabels } from "@/lib/organizational-event-bus-engine/labels";
import type { Oeb591Section } from "@/lib/organizational-event-bus-engine/config";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function EventCenterSectionPage({ activeSection }: { activeSection: Oeb591Section }) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "eventCenter");
  const t = createTranslator(dict);
  return <EventCenterPanel labels={buildEventCenterLabels(t)} activeSection={activeSection} />;
}
