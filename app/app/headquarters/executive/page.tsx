import { HeadquartersPanel } from "@/components/app/headquarters-operations";
import { buildHeadquartersLabels } from "@/lib/customer-headquarters-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function HeadquartersExecutivePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "headquartersOperations");
  const labels = buildHeadquartersLabels(createTranslator(dict));
  return (
    <HeadquartersPanel
      backHref="/app/headquarters"
      initialTab="executive_room"
      visibleTabs={["executive_room", "reports", "companion", "approvals", "overview"]}
      titleOverride={labels.executiveTitle}
      labels={labels}
    />
  );
}
