import { AipifyHostsVendorCenterDashboardPanel } from "@/components/app/aipify-hosts-vendor-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyHostsVendorsPage() {
  const dict = await getDictionary(await getLocale(), ["hosts"]);
  const t = createTranslator(dict);
  const p = "hosts.vendors";
  const c = "hosts.common";

  const catKeys = [
    "cleaning", "maintenance", "plumbing", "electrical", "locksmith", "landscaping",
    "snow_removal", "photography", "linen_services", "concierge_services", "pest_control", "other",
  ] as const;
  const vstatusKeys = ["active", "in_review", "suspended", "inactive"] as const;
  const sectionKeys = ["vendors", "contracts", "service_agreements", "certifications", "performance_reviews"] as const;
  const cstatusKeys = ["draft", "active", "expiring_soon", "expired", "terminated"] as const;
  const ctypeKeys = ["service_agreement", "maintenance_agreement", "cleaning_agreement", "seasonal_agreement", "other"] as const;
  const certtypeKeys = ["insurance", "license", "compliance_document"] as const;
  const certstatusKeys = ["valid", "expiring_soon", "expired", "missing"] as const;
  const freqKeys = ["monthly", "quarterly", "annually"] as const;

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    errorTitle: t(`${p}.errorTitle`),
    errorMessage: t(`${p}.errorMessage`),
    retry: t(`${c}.retry`),
    backToHosts: t(`${c}.backToHosts`),
    governanceNote: t(`${p}.governanceNote`),
    activeVendors: t(`${p}.activeVendors`),
    contractsExpiring: t(`${p}.contractsExpiring`),
    certsExpiring: t(`${p}.certsExpiring`),
    reviewsDue: t(`${p}.reviewsDue`),
    suspendedVendors: t(`${p}.suspendedVendors`),
    companyName: t(`${p}.companyName`),
    contactPerson: t(`${p}.contactPerson`),
    email: t(`${p}.email`),
    phoneNumber: t(`${p}.phoneNumber`),
    serviceCategory: t(`${p}.serviceCategory`),
    coverageArea: t(`${p}.coverageArea`),
    status: t(`${p}.status`),
    actions: t(`${p}.actions`),
    vendor: t(`${p}.vendor`),
    contractType: t(`${p}.contractType`),
    startDate: t(`${p}.startDate`),
    endDate: t(`${p}.endDate`),
    renewalTerms: t(`${p}.renewalTerms`),
    certificationType: t(`${p}.certificationType`),
    documentName: t(`${p}.documentName`),
    expiryDate: t(`${p}.expiryDate`),
    verificationStatus: t(`${p}.verificationStatus`),
    reviewFrequency: t(`${p}.reviewFrequency`),
    reliabilityScore: t(`${p}.reliabilityScore`),
    responseTime: t(`${p}.responseTime`),
    qualityRating: t(`${p}.qualityRating`),
    costEffectiveness: t(`${p}.costEffectiveness`),
    overallRating: t(`${p}.overallRating`),
    nextReviewDue: t(`${p}.nextReviewDue`),
    assignVendor: t(`${p}.assignVendor`),
    requestService: t(`${p}.requestService`),
    reviewPerformance: t(`${p}.reviewPerformance`),
    renewContract: t(`${p}.renewContract`),
    archiveVendor: t(`${p}.archiveVendor`),
    suspendVendor: t(`${p}.suspendVendor`),
    addVendor: t(`${p}.addVendor`),
    companyNamePlaceholder: t(`${p}.companyNamePlaceholder`),
    contactPersonPlaceholder: t(`${p}.contactPersonPlaceholder`),
    emailPlaceholder: t(`${p}.emailPlaceholder`),
    phonePlaceholder: t(`${p}.phonePlaceholder`),
    coveragePlaceholder: t(`${p}.coveragePlaceholder`),
    emptyVendorsTitle: t(`${p}.emptyVendorsTitle`),
    emptyVendorsMessage: t(`${p}.emptyVendorsMessage`),
    emptyContractsTitle: t(`${p}.emptyContractsTitle`),
    emptyContractsMessage: t(`${p}.emptyContractsMessage`),
    emptyCertsTitle: t(`${p}.emptyCertsTitle`),
    emptyCertsMessage: t(`${p}.emptyCertsMessage`),
    emptyReviewsTitle: t(`${p}.emptyReviewsTitle`),
    emptyReviewsMessage: t(`${p}.emptyReviewsMessage`),
    actionRecorded: t(`${c}.actionRecorded`),
    actionFailed: t(`${c}.actionFailed`),
  };

  for (const key of catKeys) labels[`cat_${key}`] = t(`${p}.categories.${key}`);
  for (const key of vstatusKeys) labels[`vstatus_${key}`] = t(`${p}.vendorStatuses.${key}`);
  for (const key of sectionKeys) labels[`section_${key}`] = t(`${p}.sections.${key}`);
  for (const key of cstatusKeys) labels[`cstatus_${key}`] = t(`${p}.contractStatuses.${key}`);
  for (const key of ctypeKeys) labels[`ctype_${key}`] = t(`${p}.contractTypes.${key}`);
  for (const key of certtypeKeys) labels[`certtype_${key}`] = t(`${p}.certificationTypes.${key}`);
  for (const key of certstatusKeys) labels[`certstatus_${key}`] = t(`${p}.certificationStatuses.${key}`);
  for (const key of freqKeys) labels[`freq_${key}`] = t(`${p}.reviewFrequencies.${key}`);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsVendorCenterDashboardPanel labels={labels} />
    </div>
  );
}
