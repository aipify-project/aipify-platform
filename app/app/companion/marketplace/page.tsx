import { CompanionMarketplacePanel } from "@/components/app/companion-marketplace-operations";
import { buildCompanionMarketplaceLabels } from "@/lib/customer-companion-marketplace-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CompanionMarketplacePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "companionMarketplaceOperations");
  return (
    <CompanionMarketplacePanel
      backHref="/app/companion"
      labels={buildCompanionMarketplaceLabels(createTranslator(dict))}
    />
  );
}
