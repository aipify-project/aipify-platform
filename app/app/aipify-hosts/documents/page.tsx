import { AipifyHostsDocumentCenterDashboardPanel } from "@/components/app/aipify-hosts-document-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyHostsDocumentsPage() {
  const dict = await getDictionary(await getLocale(), ["hosts"]);
  const t = createTranslator(dict);
  const p = "hosts.documents";
  const c = "hosts.common";

  const catKeys = [
    "house_rules", "emergency_procedures", "property_manuals", "inspection_reports",
    "maintenance_records", "vendor_agreements", "insurance_documents", "compliance_documents",
    "property_photos", "inventory_lists",
  ] as const;
  const dstatusKeys = ["active", "expiring_soon", "expired", "archived"] as const;
  const sectionKeys = [
    "property_documents", "safety_documents", "vendor_documents",
    "financial_documents", "templates", "archive",
  ] as const;
  const ttypeKeys = ["property_inspection_forms", "incident_reports", "vendor_agreements", "safety_checklists"] as const;

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    errorTitle: t(`${p}.errorTitle`),
    errorMessage: t(`${p}.errorMessage`),
    retry: t(`${c}.retry`),
    backToHosts: t(`${c}.backToHosts`),
    governanceNote: t(`${p}.governanceNote`),
    totalDocuments: t(`${p}.totalDocuments`),
    expiringDocuments: t(`${p}.expiringDocuments`),
    archivedDocuments: t(`${p}.archivedDocuments`),
    templateCount: t(`${p}.templateCount`),
    propertyVaults: t(`${p}.propertyVaults`),
    propertyVaultsTitle: t(`${p}.propertyVaultsTitle`),
    documentCount: t(`${p}.documentCount`),
    expiringCount: t(`${p}.expiringCount`),
    documentName: t(`${p}.documentName`),
    category: t(`${p}.category`),
    property: t(`${p}.property`),
    uploadedBy: t(`${p}.uploadedBy`),
    uploadDate: t(`${p}.uploadDate`),
    expirationDate: t(`${p}.expirationDate`),
    status: t(`${p}.status`),
    actions: t(`${p}.actions`),
    download: t(`${p}.download`),
    replaceVersion: t(`${p}.replaceVersion`),
    shareInternally: t(`${p}.shareInternally`),
    archive: t(`${p}.archive`),
    versions: t(`${p}.versions`),
    versionHistory: t(`${p}.versionHistory`),
    searchAndFilter: t(`${p}.searchAndFilter`),
    searchPlaceholder: t(`${p}.searchPlaceholder`),
    allProperties: t(`${p}.allProperties`),
    allCategories: t(`${p}.allCategories`),
    allStatuses: t(`${p}.allStatuses`),
    applyFilters: t(`${p}.applyFilters`),
    uploadDocument: t(`${p}.uploadDocument`),
    documentNamePlaceholder: t(`${p}.documentNamePlaceholder`),
    fileLabelPlaceholder: t(`${p}.fileLabelPlaceholder`),
    emptyDocumentsTitle: t(`${p}.emptyDocumentsTitle`),
    emptyDocumentsMessage: t(`${p}.emptyDocumentsMessage`),
    emptyVaultsTitle: t(`${p}.emptyVaultsTitle`),
    emptyVaultsMessage: t(`${p}.emptyVaultsMessage`),
    emptyTemplatesTitle: t(`${p}.emptyTemplatesTitle`),
    emptyTemplatesMessage: t(`${p}.emptyTemplatesMessage`),
    actionRecorded: t(`${c}.actionRecorded`),
    actionFailed: t(`${c}.actionFailed`),
  };

  for (const key of catKeys) labels[`cat_${key}`] = t(`${p}.categories.${key}`);
  for (const key of dstatusKeys) labels[`dstatus_${key}`] = t(`${p}.statuses.${key}`);
  for (const key of sectionKeys) labels[`section_${key}`] = t(`${p}.sections.${key}`);
  for (const key of ttypeKeys) labels[`ttype_${key}`] = t(`${p}.templateTypes.${key}`);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsDocumentCenterDashboardPanel labels={labels} />
    </div>
  );
}
