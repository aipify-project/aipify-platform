import { BusinessPackLegalEngineDashboardPanel } from "@/components/app/business-pack-legal-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function BusinessPackLegalEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "businessPackLegalEngine");
  const t = createTranslator(dict);
  const p = "customerApp.businessPackLegalEngine";

  const labels: Record<string, string> = {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    engineTitle: t(`${p}.engineTitle`),
    packDefinitions: t(`${p}.packDefinitions`),
    legalDocuments: t(`${p}.legalDocuments`),
    acceptanceRecords: t(`${p}.acceptanceRecords`),
    auditEvents: t(`${p}.auditEvents`),
    mandatoryDocuments: t(`${p}.mandatoryDocuments`),
    governance: t(`${p}.governance`),
    catalogTitle: t(`${p}.catalogTitle`),
    viewLegalCenter: t(`${p}.viewLegalCenter`),
    forbiddenTitle: t(`${p}.forbiddenTitle`),
    successCriteria: t(`${p}.successCriteria`),
    documents: t(`${p}.documents`),
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
      </header>
      <BusinessPackLegalEngineDashboardPanel labels={labels} />
    </div>
  );
}
