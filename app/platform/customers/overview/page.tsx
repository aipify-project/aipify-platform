import { PlatformCustomersHubShell } from "@/components/platform/customers/PlatformCustomersHubShell";
import { PlatformCustomersOverviewPanel } from "@/components/platform/customers/PlatformCustomersOverviewPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformCustomersOverviewPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  const labels = {
    title: t("platform.customersHub.overview.title"),
    subtitle: t("platform.customersHub.overview.subtitle"),
    scopeNote: t("platform.customersHub.overview.scopeNote"),
    loading: t("platform.customersHub.overview.loading"),
    errorTitle: t("platform.customersHub.overview.errorTitle"),
    errorMessage: t("platform.customersHub.overview.errorMessage"),
    retry: t("platform.customersHub.overview.retry"),
    unavailable: t("platform.customersHub.overview.unavailable"),
    openOrganizations: t("platform.customersHub.overview.openOrganizations"),
    openSuccess: t("platform.customersHub.overview.openSuccess"),
    openSupport: t("platform.customersHub.overview.openSupport"),
    kpiCustomerOrgs: t("platform.customersHub.overview.kpiCustomerOrgs"),
    kpiCustomerOrgsHelp: t("platform.customersHub.overview.kpiCustomerOrgsHelp"),
    kpiActiveSubscriptions: t("platform.customersHub.overview.kpiActiveSubscriptions"),
    kpiActiveSubscriptionsHelp: t("platform.customersHub.overview.kpiActiveSubscriptionsHelp"),
    kpiTrialing: t("platform.customersHub.overview.kpiTrialing"),
    kpiTrialingHelp: t("platform.customersHub.overview.kpiTrialingHelp"),
    kpiPastDue: t("platform.customersHub.overview.kpiPastDue"),
    kpiPastDueHelp: t("platform.customersHub.overview.kpiPastDueHelp"),
    kpiFollowUp: t("platform.customersHub.overview.kpiFollowUp"),
    kpiFollowUpHelp: t("platform.customersHub.overview.kpiFollowUpHelp"),
    kpiOpenSupport: t("platform.customersHub.overview.kpiOpenSupport"),
    kpiOpenSupportHelp: t("platform.customersHub.overview.kpiOpenSupportHelp"),
    followUpTitle: t("platform.customersHub.overview.followUpTitle"),
    followUpEmpty: t("platform.customersHub.overview.followUpEmpty"),
    definitionsTitle: t("platform.customersHub.overview.definitionsTitle"),
    statusOk: t("platform.customersHub.overview.statusOk"),
    statusAttention: t("platform.customersHub.overview.statusAttention"),
    statusCritical: t("platform.customersHub.overview.statusCritical"),
    statusInfo: t("platform.customersHub.overview.statusInfo"),
    statusUnknown: t("platform.customersHub.overview.statusUnknown"),
  };

  return (
    <PlatformCustomersHubShell>
      <PlatformCustomersOverviewPanel labels={labels} />
    </PlatformCustomersHubShell>
  );
}
