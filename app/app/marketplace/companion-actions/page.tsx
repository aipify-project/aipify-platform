import { CompanionActionMarketplacePanel } from "@/components/app/marketplace";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CompanionActionsMarketplacePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "companionActionMarketplace");
  const t = createTranslator(dict);
  const p = "customerApp.companionActionMarketplace";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <CompanionActionMarketplacePanel
        labels={{
          title: t(`${p}.title`),
          subtitle: t(`${p}.subtitle`),
          loading: t(`${p}.loading`),
          corePrinciple: t(`${p}.corePrinciple`),
          visionTitle: t(`${p}.visionTitle`),
          installedTitle: t(`${p}.installedTitle`),
          recommendedTitle: t(`${p}.recommendedTitle`),
          catalogTitle: t(`${p}.catalogTitle`),
          historyTitle: t(`${p}.historyTitle`),
          governanceTitle: t(`${p}.governanceTitle`),
          usageTitle: t(`${p}.usageTitle`),
          executionFlowTitle: t(`${p}.executionFlowTitle`),
          install: t(`${p}.install`),
          requestAction: t(`${p}.requestAction`),
          usageContext: t(`${p}.usageContext`),
          savePreferences: t(`${p}.savePreferences`),
          privacyNote: t(`${p}.privacyNote`),
          marketplaceLink: t(`${p}.marketplaceLink`),
          companionMarketplaceLink: t(`${p}.companionMarketplaceLink`),
          approvalsLink: t(`${p}.approvalsLink`),
          lifeEventsLink: t(`${p}.lifeEventsLink`),
          categories: {
            transportation: t(`${p}.categories.transportation`),
            food_delivery: t(`${p}.categories.food_delivery`),
            flowers_gifts: t(`${p}.categories.flowers_gifts`),
            travel: t(`${p}.categories.travel`),
            business_services: t(`${p}.categories.business_services`),
            lifestyle_services: t(`${p}.categories.lifestyle_services`),
          },
        }}
      />
    </div>
  );
}
