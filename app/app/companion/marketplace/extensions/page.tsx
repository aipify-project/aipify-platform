import { CompanionMarketplacePanel } from "@/components/app/companion-marketplace-operations";
import { buildCompanionMarketplaceLabels } from "@/lib/customer-companion-marketplace-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CompanionMarketplaceExtensionsPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "companionMarketplaceOperations");
  const labels = buildCompanionMarketplaceLabels(createTranslator(dict));
  return (
    <CompanionMarketplacePanel
      backHref="/app/companion/marketplace"
      initialTab="extensions"
      visibleTabs={["extensions", "installed", "updates", "publishers", "overview"]}
      titleOverride={labels.extensionsTitle}
      labels={labels}
    />
  );
}
