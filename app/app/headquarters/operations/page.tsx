import { HeadquartersPanel } from "@/components/app/headquarters-operations";
import { buildHeadquartersLabels } from "@/lib/customer-headquarters-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function HeadquartersOperationsPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "headquartersOperations");
  const labels = buildHeadquartersLabels(createTranslator(dict));
  return (
    <HeadquartersPanel
      backHref="/app/headquarters"
      initialTab="operations_room"
      visibleTabs={["operations_room", "live_activity", "approvals", "alerts", "departments", "overview"]}
      titleOverride={labels.operationsTitle}
      labels={labels}
    />
  );
}
