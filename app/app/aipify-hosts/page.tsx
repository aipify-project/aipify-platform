import { AipifyHostsDashboardPanel } from "@/components/app/aipify-hosts";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyHostsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp", "hosts"]);
  const t = createTranslator(dict);
  const p = "customerApp.aipifyHosts";
  const h = "hosts.dashboard";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          errorTitle: t(`${p}.errorTitle`),
          errorMessage: t(`${p}.errorMessage`),
          retry: t(`${p}.retry`),
          executiveSnapshot: t(`${p}.executiveSnapshot`),
          properties: t(`${p}.properties`),
          healthScore: t(`${p}.healthScore`),
          package: t(`${p}.package`),
          platforms: t(`${p}.platforms`),
          supportedPlatforms: t(`${p}.supportedPlatforms`),
          modules: t(`${p}.modules`),
          packages: t(`${p}.packages`),
          included: t(`${p}.included`),
          upgradeRequired: t(`${p}.upgradeRequired`),
          moduleCount: t(`${p}.moduleCount`),
          emptyPropertiesTitle: t(`${p}.emptyPropertiesTitle`),
          emptyPropertiesMessage: t(`${p}.emptyPropertiesMessage`),
          addProperty: t(`${p}.addProperty`),
          exploreKnowledge: t(`${p}.exploreKnowledge`),
          propertiesList: t(`${p}.propertiesList`),
          directBooking: t(`${p}.directBooking`),
          successMetrics: t(`${p}.successMetrics`),
          openAutomation: t(`${p}.openAutomation`),
          openGuestIntelligence: t(`${p}.openGuestIntelligence`),
          openTrustCompliance: t(`${p}.openTrustCompliance`),
          openExpansionIntelligence: t(`${p}.openExpansionIntelligence`),
          openCompanion: t(`${p}.openCompanion`),
          openMarketplace: t(`${p}.openMarketplace`),
          openReferrals: t(`${p}.openReferrals`),
          openKnowledge: t(`${p}.openKnowledge`),
          openReports: t(`${p}.openReports`),
          openOperations: t(`${p}.openOperations`),
          openPropertyCenter: t(`${p}.openPropertyCenter`),
          openGuestCenter: t(`${p}.openGuestCenter`),
          openTeamCenter: t(`${p}.openTeamCenter`),
          openTasksCenter: t(`${p}.openTasksCenter`),
          openFinanceCenter: t(`${h}.openFinanceCenter`),
          openNotificationCenter: t(`${h}.openNotificationCenter`),
          openIncidentCenter: t(`${h}.openIncidentCenter`),
          openQualityCenter: t(`${h}.openQualityCenter`),
          openSuppliesCenter: t(`${h}.openSuppliesCenter`),
          openVendorCenter: t(`${h}.openVendorCenter`),
          openDocumentCenter: t(`${h}.openDocumentCenter`),
          openCalendarCenter: t(`${h}.openCalendarCenter`),
          openCheckInCenter: t(`${h}.openCheckInCenter`),
          openOwnerCenter: t(`${h}.openOwnerCenter`),
          openPropertyHealth: t(`${h}.openPropertyHealth`),
          capacityLabel: t(`${p}.licensing.capacityLabel`),
          propertyLimit: t(`${p}.licensing.propertyLimit`),
          propertyLimitCount: t(`${p}.licensing.propertyLimitCount`),
          customLimit: t(`${p}.licensing.customLimit`),
          allModulesIncluded: t(`${p}.licensing.allModulesIncluded`),
          upgradeHeadline: t(`${p}.licensing.upgradeHeadline`),
          upgradeDescription: t(`${p}.licensing.upgradeDescription`),
          viewPlans: t(`${p}.licensing.viewPlans`),
          upgradeNow: t(`${p}.licensing.upgradeNow`),
          contactSales: t(`${p}.licensing.contactSales`),
          addPropertyLicense: t(`${p}.licensing.addPropertyLicense`),
          addPropertyLicenseTitle: t(`${p}.licensing.addPropertyLicenseTitle`),
          addPropertyLicenseDescription: t(`${p}.licensing.addPropertyLicenseDescription`),
          addingLicense: t(`${p}.licensing.addingLicense`),
          addPropertyFormTitle: t(`${p}.licensing.addPropertyFormTitle`),
          addPropertyFormDescription: t(`${p}.licensing.addPropertyFormDescription`),
          propertyNameLabel: t(`${p}.licensing.propertyNameLabel`),
          propertyNamePlaceholder: t(`${p}.licensing.propertyNamePlaceholder`),
          saveProperty: t(`${p}.licensing.saveProperty`),
          savingProperty: t(`${p}.licensing.savingProperty`),
          cancel: t(`${p}.licensing.cancel`),
          addAnotherProperty: t(`${p}.licensing.addAnotherProperty`),
          additionalLicensesNote: t(`${p}.licensing.additionalLicensesNote`),
        }}
      />
    </div>
  );
}
