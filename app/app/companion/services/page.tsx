import { CompanionEcosystemPanel } from "@/components/app/companion-ecosystem-operations";
import { buildCompanionEcosystemLabels } from "@/lib/customer-companion-ecosystem-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CompanionServicesMarketplacePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "companionEcosystemOperations");
  return (
    <CompanionEcosystemPanel
      backHref="/app/companion/ecosystem"
      initialTab="marketplace"
      visibleTabs={["marketplace", "services", "providers", "requests", "overview"]}
      labels={buildCompanionEcosystemLabels(createTranslator(dict))}
    />
  );
}
